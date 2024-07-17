import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const New = ({ inputs, title, database }) => {
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(null);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [emptyResult, setEmptyResult] = useState(false);
  const [guide, setGuide] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [typeOptions, setTypeOptions] = useState({});

  const defaultProductData = {
    idProduct: "1100EE00",
    product: "Benang Obras",
  };
  const [data, setData] = useState(
    database === "products" ? defaultProductData : {}
  );

  const handleGetData = async () => {
    setFetching(true);
    const currentTime = Timestamp.fromDate(new Date());
    setTimeout(async () => {
      const id = await fetchIdFromFirebase(currentTime);
      if (!id) {
        setEmptyResult(true);
      } else {
        setData((prevData) => ({
          ...prevData,
          id, // Set the fetched id to the "id" property in data state
        }));
      }
      setFetching(false);
    }, 30000); // delay 30 seconds
  };

  const handleClosePopup = () => {
    setEmptyResult(false); // Close the pop-up message
    setGuide(false);
    setError(false);
  };

  const handleGuide = () => {
    setGuide(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setGuide(true);
    }, 0);
    const fetchOptions = async () => {
      const options = {};

      for (const input of inputs) {
        if (input.type === "dropdown") {
          let q;
          let field;
          let additionalFields = [];
          switch (input.id) {
            case "number":
              q = query(collection(db, "warna"));
              field = "number";
              additionalFields = ["color"];
              break;
            case "type":
              q = query(collection(db, "jenis"));
              field = "type";
              break;
            case "variant":
              q = query(collection(db, "kones"));
              field = "variant";
              break;
            case "weight":
              q = query(collection(db, "berat"));
              field = "weight";
              break;
            case "stock":
              q = query(collection(db, "amount"));
              field = "stock";
              break;
            case "client":
              q = query(collection(db, "toko"));
              field = "client";
              break;
            default:
              break;
          }

          if (q && field) {
            const querySnapshot = await getDocs(q);
            options[input.id] = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              let option = {
                label: data[field], // Menggunakan field yang sesuai sebagai label
                value: data[field], // Menggunakan nilai yang sesuai dari field
                id: doc.id, // Simpan ID dokumen untuk referensi
              };
              // Tambahkan fields tambahan ke option
              additionalFields.forEach((addField) => {
                option[addField] = data[addField];
              });
              return option;
            });
          }
        }
      }

      setTypeOptions(options);
    };

    fetchOptions();

    const uploadFile = () => {
      const name = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPercent(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL, imgName: name }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file, inputs]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleInputChange = (e) => {
    // Allow changes only in the additional part of the input
    const id = e.target.id;
    const newValue = e.target.value;
    setData({ ...data, [id]: newValue });
  };
  const handleDropdownChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    // Temukan objek yang sesuai di typeOptions untuk mendapatkan ID dokumen
    const selectedOption = typeOptions[id].find(
      (option) => option.value === value
    );

    if (id === "number") {
      // Set value for idWarna based on the selected option from the "number" dropdown
      setData((prevData) => ({
        ...prevData,
        [id]: value, // Mengatur nomor warna
        idColor: selectedOption ? selectedOption.id : "", // Mengatur idColor
        color: selectedOption ? selectedOption.color : "",
      }));
    } else if (id === "type") {
      // Set value for idType based on the selected option from the "type" dropdown
      setData((prevData) => ({
        ...prevData,
        [id]: value, // Mengatur jenis benang
        idType: selectedOption ? selectedOption.id : "", // Mengatur idType
      }));
    } else if (id === "variant") {
      // Set value for idCones based on the selected option from the "variant" dropdown
      setData((prevData) => ({
        ...prevData,
        [id]: value, // Mengatur varian kones
        idCones: selectedOption ? selectedOption.id : "", // Mengatur idCones
      }));
    } else if (id === "weight") {
      // Set value for idSize based on the selected option from the "weight" dropdown
      setData((prevData) => ({
        ...prevData,
        [id]: value, // Mengatur berat per-satuan
        idSize: selectedOption ? selectedOption.id : "", // Mengatur idSize
      }));
    } else if (id === "stock") {
      // Set value for idAmount based on the selected option from the "stock" dropdown
      setData((prevData) => ({
        ...prevData,
        [id]: value, // Mengatur stok
        idAmount: selectedOption ? selectedOption.id : "", // Mengatur idAmount
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };
  const fetchIdFromFirebase = async (currentTime) => {
    try {
      // const today = new Date();
      // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      // const todayTimestamp = Timestamp.fromDate(startOfDay);
      // console.log(startOfDay, todayTimestamp);
      const queryTag = query(
        collection(db, "tags"),
        where("timeStamp", ">=", currentTime),
        orderBy("timeStamp", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(queryTag);
      if (!querySnapshot.empty) {
        const newestId = querySnapshot.docs[0].id;
        console.log(newestId);

        const firstSixteenDigits = newestId.slice(0, 16);
        console.log("First Sixteen Digits:", firstSixteenDigits);

        const productsData = await fetchDataFromProducts(firstSixteenDigits);
        console.log("Products Data:", productsData);

        setData({ ...data, ...productsData });
        return newestId;
      }
    } catch (error) {
      console.error("Error getting newest ID: ", error);
      setError(true);
      setMessage("No ID found. Please try again.");
    }
  };

  const fetchDataFromProducts = async (code) => {
    try {
      // Construct a query to fetch data from the "products" collection
      const productsId = code.slice(0, 8);
      console.log(productsId);
      const productDocRef = doc(db, "products", productsId);
      const productSnapshot = await getDoc(productDocRef);

      if (productSnapshot.exists()) {
        // Extract the data from the query snapshot
        const productsData = productSnapshot.data();
        console.log("Products Data:", productsData);
        const colorId = code.slice(8, 11);
        const typeId = code.slice(11, 12);
        const conesId = code.slice(12, 13);
        const sizeId = code.slice(13, 15);
        const amountId = code.slice(15, 16);
        console.log(colorId, typeId, conesId, sizeId, amountId);
        const colorDocRef = doc(productDocRef, "warna", colorId);
        const colorSnapshot = await getDoc(colorDocRef);
        if (colorSnapshot.exists()) {
          const colorData = colorSnapshot.data();

          const typeDocRef = doc(colorDocRef, "jenis", typeId);
          const typeSnapshot = await getDoc(typeDocRef);
          if (typeSnapshot.exists()) {
            const typeData = typeSnapshot.data();

            const coneDocRef = doc(typeDocRef, "kones", conesId);
            const coneSnapshot = await getDoc(coneDocRef);
            if (coneSnapshot.exists()) {
              const coneData = coneSnapshot.data();

              const sizeDocRef = doc(coneDocRef, "ukuran", sizeId);
              const sizeSnapshot = await getDoc(sizeDocRef);
              if (sizeSnapshot.exists()) {
                const sizeData = sizeSnapshot.data();

                const amountDocRef = doc(sizeDocRef, "jumlah", amountId);
                const amountSnapshot = await getDoc(amountDocRef);
                if (amountSnapshot.exists()) {
                  const amountData = amountSnapshot.data();
                  const fetchedData = {
                    ...productsData,
                    ...colorData,
                    ...typeData,
                    ...coneData,
                    ...sizeData,
                    ...amountData,
                  };
                  return fetchedData;
                } else {
                  console.log("no doc found in amount collection");
                }
              } else {
                console.log("no doc found in size collection");
              }
            } else {
              console.log("no doc found in cones collection");
            }
          } else {
            console.log("no doc found in type collection");
          }
          return productsData;
        } else {
          console.log("No matching document found in 'color' collection.");
        }
      } else {
        console.log("No matching document found in 'products' collection.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from 'products' collection:", error);
      return [];
    }
  };

  const getStok = async (stokId) => {
    try {
      const stokDocRef = doc(db, "stok", stokId);
      const stokSnapshot = await getDoc(stokDocRef);

      if (stokSnapshot.exists()) {
        const stokData = stokSnapshot.data();
        return stokData;
      } else {
        console.log("No matching document found in 'stok' collection.");
        return null;
      }
    } catch (error) {
      console.error("Error getting data from 'stok' collection:", error);
      return null;
    }
  };

  const deleteStokData = async (stokId) => {
    try {
      // Fetch stok document from the database
      const docRef = doc(db, "stok", stokId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // Delete stok document from the database
        await deleteDoc(docRef);
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const uid = uuidv4();
    try {
      if (database === "users") {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        await setDoc(doc(db, database, res.user.uid), {
          ...data,
          timeStamp: serverTimestamp(),
        });
      } else if (database === "toko") {
        await setDoc(doc(db, database, uid), {
          ...data,
          timeStamp: serverTimestamp(),
        });
      } else if (database === "products") {
        const productRef = doc(db, "products", data.idProduct);
        await setDoc(productRef, {
          product: data.product,
          timeStamp: serverTimestamp(),
        });

        // Set warna subdocument
        const warnaRef = doc(productRef, "warna", data.idColor);
        await setDoc(warnaRef, {
          color: data.color,
          number: data.number,
          img: data.img || "",
        });
        const typeRef = doc(warnaRef, "jenis", data.idType);
        await setDoc(typeRef, {
          type: data.type,
        });
        const coneRef = doc(typeRef, "kones", data.idCones);
        await setDoc(coneRef, {
          variant: data.variant,
        });

        // Set details subdocument within warna
        const sizeRef = doc(coneRef, "ukuran", data.idSize);
        await setDoc(sizeRef, {
          weight: data.weight,
        });
        const amountRef = doc(sizeRef, "jumlah", data.idAmount);
        await setDoc(amountRef, {
          stock: data.stock,
        });
      } else if (database === "stok") {
        const stokId = data.id;
        if (stokId) {
          // Add tagId to document
          await setDoc(doc(db, database, stokId), {
            ...data,
            timeStamp: serverTimestamp(),
          });
        }
      } else if (database === "kirim") {
        // Add new document if no existing document found
        const stokId = data.id;
        console.log(stokId);
        if (stokId) {
          // Add tagId to document
          const stokData = await getStok(stokId);
          console.log(stokData);
          await setDoc(doc(db, database, stokId), {
            ...data,
            ...stokData,
            timeStamp: serverTimestamp(),
          });
          await deleteStokData(stokId);
        }
      } else {
        const id = data.id;
        if (id) {
          await setDoc(doc(db, database, id), {
            ...data,
          });
        }
      }
      navigate(-1);
    } catch (err) {
      console.log(err);
      setError(true);
      setMessage("Terdapat error. Coba ulang kembali.");
    }
  };

  return (
    <div className="new">
      <Sidebar disabled={fetching} />
      <div className="newContainer">
        <Navbar disabled={fetching} />
        <div className="top">
          <h1>{title}</h1>
          {database !== "toko" && database !== "users" && (
            <div className="top-right">
              <button
                className="orange-button"
                disabled={fetching}
                onClick={handleGuide}
              >
                PANDUAN
              </button>
            </div>
          )}
          {guide &&
            database !== "products" &&
            database !== "stok" &&
            database !== "kirim" &&
            database !== "toko" &&
            database !== "users" && (
              <div className="popup show">
                <div className="popup-inner">
                  <p>Panduan:</p>
                  <ul>
                    <li>
                      Ikuti tabel panduan:{" "}
                      <a
                        href="https://docs.google.com/spreadsheets/d/1zcfO4er1JyRPriUbqyzxFwQUKJukeQBK13Y6rLKJoV0/edit#gid=0&range=A1:P24"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        klik di sini
                      </a>
                    </li>
                  </ul>
                  <button onClick={handleClosePopup} className="orange-button">
                    Tutup
                  </button>
                </div>
              </div>
            )}
          {guide && database === "products" && (
            <div className="popup show">
              <div className="popup-inner">
                <p>Panduan Kode Tag:</p>
                <ul>
                  <li>1100EE0000411011 = Panjang kode 16 digit.</li>
                  <li>1100EE00 Default sebagai kode benang obras.</li>
                  <li>
                    8 digit selanjutnya sesuai tabel panduan:{" "}
                    <a
                      href="https://docs.google.com/spreadsheets/d/1zcfO4er1JyRPriUbqyzxFwQUKJukeQBK13Y6rLKJoV0/edit#gid=0&range=A1:P24"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      klik di sini
                    </a>
                  </li>
                  <li>
                    Jika data belum tersedia, tambahkan data pada masing-masing
                    halaman data.
                  </li>
                  <li>
                    Setelah menambahkan kode tag, lakukan re-write sesuai
                    panduan pada halaman "Detail".
                  </li>
                </ul>
                {/* <img
                  src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/guideCode.png?alt=media&token=77d7cb8c-0d34-4c66-9695-a3a4d5193c55"
                  alt="Panduan Kode"
                /> */}
                <button onClick={handleClosePopup} className="orange-button">
                  Tutup
                </button>
              </div>
            </div>
          )}
          {guide && (database === "stok" || database === "kirim") && (
            <div className="popup show">
              <div className="popup-inner">
                <p>Panduan Pendataan Stok & Kirim Barang:</p>
                <ul>
                  <li>
                    Contoh TagID:{" "}
                    <a
                      href="https://docs.google.com/spreadsheets/d/1zcfO4er1JyRPriUbqyzxFwQUKJukeQBK13Y6rLKJoV0/edit#gid=95701413&range=A1:G6"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      klik di sini
                    </a>
                  </li>
                  <li>
                    Klik tombol "Pindai Tag ID", terdapat jeda 30 detik untuk
                    menunggu scan tag
                  </li>
                  <li>
                    Selama jeda 30 detik, bawa barang yang sudah ditempelkan
                    stiker tag melewati alat scan
                  </li>
                  <li>Cek data yang masuk, bila sesuai klik tombol "kirim".</li>
                  <li>
                    Jika data tidak sesuai / belum masuk, lakukan scan kembali
                  </li>
                </ul>
                <button onClick={handleClosePopup} className="orange-button">
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bottom">
          {database === "products" && (
            <div className="left">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            </div>
          )}
          {(database === "stok" || database === "kirim") && (
            <div className="left">
              <img
                src={
                  data.img ||
                  "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            </div>
          )}
          <div className="right">
            <form onSubmit={handleAdd}>
              {database === "products" && (
                <div className="formRow">
                  <label htmlFor="file">
                    Gambar: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
              )}
              {(database === "stok" || database === "kirim") && (
                <div className="getData">
                  <button
                    onClick={handleGetData}
                    disabled={fetching}
                    className="orange-button"
                  >
                    {fetching ? "Memindai..." : "Pindai Tag ID"}
                  </button>
                </div>
              )}
              {emptyResult && (
                <div className="popup show">
                  <div className="popup-inner">
                    <p>Data tidak ditemukan</p>
                    <button
                      onClick={handleClosePopup}
                      className="orange-button"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
              {error && (
                <div className="popup show">
                  <div className="popup-inner">
                    <p style={{ color: "red" }}>{message}</p>
                    <button
                      onClick={handleClosePopup}
                      className="orange-button"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
              {(database === "products" || database === "kirim") &&
                inputs.map((input) => (
                  <div
                    className={
                      input.id === "idProduct" ||
                      input.id === "product" ||
                      input.id === "idColor" ||
                      input.id === "color" ||
                      input.id === "number"
                        ? "formRow"
                        : "formInput"
                    }
                    key={input.id}
                  >
                    <label>{input.label}</label>
                    {input.type === "dropdown" ? (
                      <select
                        id={input.id}
                        value={data[input.id] || ""}
                        onChange={handleDropdownChange}
                      >
                        <option value="" disabled>
                          {input.placeholder}
                        </option>
                        {(typeOptions[input.id] || input.options).map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={data[input.id] || ""}
                        onChange={handleInputChange}
                        minLength={input.minLength}
                        maxLength={input.maxLength}
                        readOnly={input.readOnly}
                      />
                    )}
                  </div>
                ))}
              {database !== "products" &&
                database !== "kirim" &&
                inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      value={data[input.id] || ""} // Autofill input value from data state
                      onChange={handleInput}
                      minLength={input.minLength}
                      maxLength={input.maxLength}
                      readOnly={input.readOnly}
                    />
                  </div>
                ))}

              <button
                disabled={(percent !== null && percent < 100) || fetching}
                type="submit"
                className="orange-button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
