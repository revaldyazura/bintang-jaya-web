
import "./navbar.scss";
import { useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const currentDate = new Date().toLocaleDateString();
  // const currentTime = new Date().toLocaleTimeString();
  const [time, setTime] = useState(new Date());
  const { currentUser } = useContext(AuthContext);
  const uid = currentUser.uid;
  const [role, setRole] = useState(null); // State to hold the role

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
    getPosition();
  }, []);

  const getPosition = async () => {
    try {
      if (uid !== "EaMqYgiaC0cTno7ch8W5Wi3f2np2") {
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);
        // console.log(uid);
        // console.log(snapshot);
        if (!snapshot.empty) {
          const userData = snapshot.data();
          // console.log(userData);
          setRole(userData.position);
        } else {
          console.log("No matching documents.");
        }
      } else {
        setRole("Admin")
      }
    } catch (error) {
      console.error("Error getting newest ID: ", error);
    }
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          <div className="item">
            <p>{currentDate}</p>
          </div>
          <div className="item">
            <span>{time.toLocaleTimeString()}</span>
          </div>
          <div className="item">
            <span>Akun: {role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
