import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
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
    } catch (error) {
      console.error("Error getting newest ID: ", error);
    }
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        {/* <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div> */}
        <div className="items">
          {/* <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div> */}
          <div className="item">
            <p>{currentDate}</p>
          </div>
          <div className="item">
            <span>{time.toLocaleTimeString()}</span>
          </div>
          <div className="item">
            <span>Akun: {role}</span>
          </div>
          {/* <Link to="/users/:Id" style={{ textDecoration: "none" }}>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt=""
                className="avatar"
              />
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
