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

const New = ({ inputs, title, database }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [percent, setPercent] = useState(null);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [productId, setProductId] = useState("");
  const [emptyResult, setEmptyResult] = useState(false);

  const handleButtonClick = async () => {
    setFetching(true);
    setTimeout(async () => {
      const id = await fetchIdFromFirebase();
      if (!id) {
        setEmptyResult(true);
      } else {
        setData((prevData) => ({
          ...prevData,
          id, // Set the fetched id to the "id" property in data state
        }));
      }
      setFetching(false);
    }, 10000); // delay 10 seconds
  };
  const handleClosePopup = () => {
    setEmptyResult(false); // Close the pop-up message
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
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
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
    if (id === "id" && database === "products") {
      setProductId(value); // Update the documentId state with the input value
    }
  };

  const fetchIdFromFirebase = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const todayTimestamp = Timestamp.fromDate(startOfDay);
      console.log(startOfDay, todayTimestamp);
      const queryTag = query(
        collection(db, "tags"),
        where("timeStamp", ">=", todayTimestamp),
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

        // Call getStok function with newestId
        await getStok(newestId);

        await fetchDataFromProducts(firstSixteenDigits);
        return newestId;
      }
    } catch (error) {
      console.error("Error getting newest ID: ", error);
    }
  };

  const fetchDataFromProducts = async (firstSixteenDigits) => {
    try {
      // Construct a query to fetch data from the "products" collection
      const firstEightDigits = firstSixteenDigits.slice(0, 8);
      console.log(firstEightDigits);
      const productDocRef = doc(db, "products", firstEightDigits);
      const productSnapshot = await getDoc(productDocRef);

      if (productSnapshot.exists()) {
        // Extract the data from the query snapshot
        const productsData = productSnapshot.data();
        console.log("Products Data:", productsData);
        const twoDigitsColor = firstSixteenDigits.slice(8, 10);
        const twoDigitsDetails = firstSixteenDigits.slice(10, 12);
        const twoDigitsSize = firstSixteenDigits.slice(12, 14);
        const twoDigitsCones = firstSixteenDigits.slice(14, 16);
        console.log(
          twoDigitsColor,
          twoDigitsDetails,
          twoDigitsSize,
          twoDigitsCones
        );
        // const colorDocRef = doc(db, "products", firstEightDigits, sixDigitsColor, twoDigitsColorDetail)
        const colorDocRef = doc(productDocRef, "warna", twoDigitsColor);
        const colorSnapshot = await getDoc(colorDocRef);
        if (colorSnapshot.exists()) {
          const colorData = colorSnapshot.data();

          console.log("color data: ", colorData);
          const detailDocRef = doc(colorDocRef, "details", twoDigitsDetails);
          const detailSnapshot = await getDoc(detailDocRef);
          if (detailSnapshot.exists()) {
            const detailData = detailSnapshot.data();
            console.log("Details Data: ", detailData);
            const sizeDocRef = doc(detailDocRef, "ukuran", twoDigitsSize);
            const sizeSnapshot = await getDoc(sizeDocRef);
            if (sizeSnapshot.exists()) {
              const sizeData = sizeSnapshot.data();
              console.log("Size data: ", sizeData);

              const coneDocRef = doc(sizeDocRef, "cones", twoDigitsCones);
              const coneSnapshot = await getDoc(coneDocRef);
              if (coneSnapshot.exists()) {
                const coneData = coneSnapshot.data();
                console.log("cones data: ", coneData);

                const fetchedData = {
                  ...productsData,
                  ...colorData,
                  ...detailData,
                  ...sizeData,
                  ...coneData,
                };
                return fetchedData;
              } else {
                console.log("no doc found in cones collection");
              }
            } else {
              console.log("no doc found in size collection");
            }
          } else {
            console.log("no doc found in details collection");
          }
        } else {
          console.log("no doc found in color collection");
        }
        return productsData;
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
        console.log("Stok Data:", stokData);
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
      }
      if (database === "products") {
        const idProduct = productId.substring(0, 8); // 8 char product ID
        const idColor = productId.substring(8, 10); // 2 char color ID
        const idDetails = productId.substring(10, 12);
        const idSize = productId.slice(12, 14);
        const idCones = productId.slice(14, 16);

        const productRef = doc(db, "products", idProduct);
        await setDoc(productRef, {
          product: data.product,
          timeStamp: serverTimestamp(),
        });

        // Set warna subdocument
        const warnaRef = doc(productRef, "warna", idColor);
        await setDoc(warnaRef, {
          color: data.color
        });

        // Set details subdocument within warna
        const detailsRef = doc(warnaRef, "details", idDetails);
        await setDoc(detailsRef, {
          specific: data.specific,
          number: data.number,
          stock: data.stock,
        });
        const sizeRef = doc(detailsRef, "ukuran", idSize);
        await setDoc(sizeRef, {
          thickness: data.thickness,
          weight: data.weight
        });
        const coneRef = doc(sizeRef, "cones", idCones);
        await setDoc(sizeRef, {
          height: data.height
        });
      }
      if (database === "stok") {
        const newestId = await fetchIdFromFirebase();
        if (newestId) {
          // Add tagId to document
          await setDoc(doc(db, database, newestId), {
            ...data,
            timeStamp: serverTimestamp(),
          });
        }
      }
      if (database === "kirim") {
        // Add new document if no existing document found
        const newestId = await fetchIdFromFirebase();
        if (newestId) {
          // Add tagId to document
          const stokData = await getStok(newestId);
          console.log(stokData);
          await setDoc(doc(db, database, newestId), {
            ...data,
            ...stokData,
            timeStamp: serverTimestamp(),
          });
          await deleteStokData(newestId);
        }
      }
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          {database === "stok" && (
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
          <div className="right">
            <form onSubmit={handleAdd}>
              {database === "stok" && (
                <div className="formInput">
                  <label htmlFor="file">
                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
              )}
              {database !== "users" && database !== "products" && (
                <div className="getData">
                  <button onClick={handleButtonClick} disabled={fetching}>
                    {fetching ? "Memindai..." : "Pindai Tag ID"}
                  </button>
                </div>
              )}
              {emptyResult && (
                <div className="popup">
                  <div className="popup-inner">
                    <p>Data tidak ditemukan</p>
                    <button onClick={handleClosePopup}>Kembali</button>
                  </div>
                </div>
              )}
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={data[input.id] || ""} // Autofill input value from data state
                    onChange={handleInput}
                  />
                </div>
              ))}

              <button
                disabled={percent !== null && percent < 100}
                type="submit"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
