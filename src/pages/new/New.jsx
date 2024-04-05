import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
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
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title, database }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [percent, setPercent] = useState(null);
  const [firebaseId, setFirebaseId] = useState(null);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  // const [stok, setStok] = useState([null]);

  const handleButtonClick = async () => {
    setFetching(true);
    setTimeout(async () => {
      await fetchIdFromFirebase();
      await getStok();
      setFetching(false);
    }, 10000); // 10 seconds delay
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
  };

  const fetchIdFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "products"),
          orderBy("timeStamp", "desc"),
          limit(1)
        )
      );
      if (!querySnapshot.empty) {
        const newestId = querySnapshot.docs[0].id;
        setFirebaseId(newestId);
        console.log(newestId);
        // Call getStok function with newestId
        await getStok(newestId);
        return newestId;
      }
    } catch (error) {
      console.error("Error getting newest ID: ", error);
    }
  };

  const getStok = async (stokId) => {
    try {
      const stokDocRef = doc(db, "stok", stokId);
      const stokSnapshot = await getDoc(stokDocRef);

      if (stokSnapshot.exists()) {
        const stokData = stokSnapshot.data();
        console.log("Stok Data:", stokData);
        // setStok(stokData);
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
      // Fetch the document from the database
      const docRef = doc(db, "stok", stokId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // // Retrieve the value of the "img" field
        // const imgNameValue = docSnapshot.data().imgName;
        // // Create a reference to the file to delete
        // const deleteRef = ref(storage, imgNameValue);
        // // Delete the file
        // deleteObject(deleteRef)
        //   .then(() => {
        //     console.log("file deleted");
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });

        // Delete the document from the database
        await deleteDoc(docRef);

        // Update the data array, filtering out the deleted document
        // setData(data.filter((item) => item.id !== id));
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
              {database === "kirim" && (
                <div className="getData">
                  <div className="idData">
                    <span>TagID:&nbsp;</span>
                    {firebaseId && (
                      <div className="data">
                        <span>{firebaseId}&nbsp;</span>
                      </div>
                    )}

                    <button onClick={handleButtonClick} disabled={fetching}>
                      {fetching ? "Memindai..." : "Pindai Tag ID"}
                    </button>
                  </div>
                  {/* <div className="stokData">
                    <span>Nama Barang:&nbsp;</span>
                    {stok ? (
                      <span className="visible">{stok.product}&nbsp;</span>
                    ) : (
                      <span className="invisible">Product Not Available</span>
                    )}

                    <button onClick={handleButtonClick} disabled={fetching}>
                      {fetching ? "Memindai..." : "Ambil Data Stok"}
                    </button>
                  </div> */}
                </div>
              )}
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
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
