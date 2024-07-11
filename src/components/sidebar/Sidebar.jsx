import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import ScaleIcon from "@mui/icons-material/Scale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LogoutIcon from "@mui/icons-material/Logout";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClassIcon from "@mui/icons-material/Class";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const uid = currentUser?.uid;

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <div className="top">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Bintang Jaya</span>
          </Link>
        </div>
        <hr />
        <div className="center">
          <ul>
            <p className="title">UTAMA</p>
            <a href="/">
              <li
                className={
                  location.pathname === "/" ? "nav-item active" : "nav-item"
                }
              >
                <DashboardIcon className="icon" />
                <span>Beranda</span>
              </li>
            </a>
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <p className="title">DATA</p>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/warna">
                <li
                  className={
                    location.pathname === "/warna"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <ColorLensIcon className="icon" />
                  <span>Warna</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/jenis">
                <li
                  className={
                    location.pathname === "/jenis"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <FilterListIcon className="icon" />
                  <span>Jenis</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/kones">
                <li
                  className={
                    location.pathname === "/kones"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <ChangeHistoryIcon className="icon" />
                  <span>Kones</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/berat">
                <li
                  className={
                    location.pathname === "/berat"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <ScaleIcon className="icon" />
                  <span>Berat</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/jumlah">
                <li
                  className={
                    location.pathname === "/jumlah"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <PlusOneIcon className="icon" />
                  <span>Jumlah</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/toko">
                <li
                  className={
                    location.pathname === "/toko"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <StoreIcon className="icon" />
                  <span>Toko</span>
                </li>
              </a>
            )}
            {uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3" && (
              <a href="/kode">
                <li
                  className={
                    location.pathname === "/kode"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <ClassIcon className="icon" />
                  <span>Kode Tag</span>
                </li>
              </a>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <a href="/pengguna">
                <li
                  className={
                    location.pathname === "/pengguna"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <PersonOutlineOutlinedIcon className="icon" />
                  <span>Pengguna</span>
                </li>
              </a>
            )}
            {uid !== "EaMqYgiaC0cTno7ch8W5Wi3f2np2" && (
              <>
                <p className="title">BARANG</p>
                <a href="/stok">
                  <li
                    className={
                      location.pathname === "/stok"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <WarehouseIcon className="icon" />
                    <span>Stok</span>
                  </li>
                </a>
                <a href="/kirim">
                  <li
                    className={
                      location.pathname === "/kirim"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <LocalShippingIcon className="icon" />
                    <span>Kirim</span>
                  </li>
                </a>
              </>
            )}

            <p className="title">AKUN</p>
            <NavLink
              onClick={handleLogout}
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <li>
                <LogoutIcon className="icon" />
                <span>Keluar</span>
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
      <div
        className={`hamburger-menu ${isOpen ? "open" : ""}`}
        id="hamburger-menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
      </div>
    </>
  );
};

export default Sidebar;
