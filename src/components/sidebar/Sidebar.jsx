import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate, NavLink } from "react-router-dom";
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

  const handleFullPageRefresh = (url) => {
    window.location.href = url; // This will cause the browser to fully reload the page
  };

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
          <p className="title">DATA</p>
          {uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" && (
            <NavLink
              onClick={() => handleFullPageRefresh("/produk")}
              to="/produk"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <li>
                <CategoryOutlinedIcon className="icon" />
                <span>Produk</span>
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

          <NavLink
            onClick={() => handleFullPageRefresh("/stok")}
            to="/stok"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <li>
              <StoreIcon className="icon" />
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

          <p className="title">PENGGUNA</p>
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
  );
};

export default Sidebar;
