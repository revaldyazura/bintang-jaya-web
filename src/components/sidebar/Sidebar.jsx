import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from '@mui/icons-material/Category';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import ScaleIcon from '@mui/icons-material/Scale';
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LogoutIcon from "@mui/icons-material/Logout";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClassIcon from '@mui/icons-material/Class';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleFullPageRefresh = (url) => {
    window.location.href = url; // This will cause the browser to fully reload the page
  };

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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <li>
                <DashboardIcon className="icon" />
                <span>Beranda</span>
              </li>
            </NavLink>
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
                <p className="title">DATA</p>)}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/warna")}
                to="/warna"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <ColorLensIcon className="icon" />
                  <span>Warna</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/jenis")}
                to="/jenis"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <FilterListIcon className="icon" />
                  <span>Jenis</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/kones")}
                to="/kones"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <ChangeHistoryIcon className="icon" />
                  <span>Kones</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/berat")}
                to="/berat"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <ScaleIcon className="icon" />
                  <span>Berat</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/jumlah")}
                to="/jumlah"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <PlusOneIcon className="icon" />
                  <span>Jumlah</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/toko")}
                to="/toko"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <StoreIcon className="icon" />
                  <span>Toko</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/kode")}
                to="/kode"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <ClassIcon className="icon" />
                  <span>Kode Tag</span>
                </li>
              </NavLink>
            )}
            {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
              uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
              <NavLink
                onClick={() => handleFullPageRefresh("/pengguna")}
                to="/pengguna"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <li>
                  <PersonOutlineOutlinedIcon className="icon" />
                  <span>Pengguna</span>
                </li>
              </NavLink>
            )}
            <p className="title">BARANG</p>
            <NavLink
              onClick={() => handleFullPageRefresh("/stok")}
              to="/stok"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <li>
                <WarehouseIcon className="icon" />
                <span>Stok</span>
              </li>
            </NavLink>
            <NavLink
              onClick={() => handleFullPageRefresh("/kirim")}
              to="/kirim"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <li>
                <LocalShippingIcon className="icon" />
                <span>Kirim</span>
              </li>
            </NavLink>

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

