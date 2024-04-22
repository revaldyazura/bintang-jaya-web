import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamIcon from "@mui/icons-material/SettingsSystemDaydream";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const uid = currentUser.uid;
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Bintang Jaya</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">UTAMA</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Beranda</span>
            </li>
          </Link>
          <p className="title">DATA</p>
          {uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" && (
            <div>
              <a href="/pengguna" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineOutlinedIcon className="icon" />
                  <span>Pengguna</span>
                </li>
              </a>
              <a href="/produk" style={{ textDecoration: "none" }}>
                <li>
                  <CategoryOutlinedIcon className="icon" />
                  <span>Produk</span>
                </li>
              </a>
            </div>
          )}

          <a href="/stok" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Stok</span>
            </li>
          </a>
          <a href="/kirim" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Kirim</span>
            </li>
          </a>
          {/* <li>
            <ShoppingBagIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsIcon className="icon" />
            <span>Settings</span>
          </li> */}
          <p className="title">PENGGUNA</p>
          {/* <Link to={`/pengguna/${uid}`} style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profil</span>
            </li>
          </Link> */}
          <Link onClick={handleLogout} style={{ textDecoration: "none" }}>
            <li>
              <LogoutIcon className="icon" />
              <span>Keluar</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        {/* <div className="colorOption"></div>
        <div className="colorOption"></div>
        <div className="colorOption"></div> */}
      </div>
    </div>
  );
};

export default Sidebar;
