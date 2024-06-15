import { useContext, useState } from "react";
import "./login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
        // ...
      })
      .catch((error) => {
        setError(true);
        // ..
      });
  };
  const handleInputChange = (e) => {
    setError(false); // Reset error state on input change
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/logo-bintang-jaya.png?alt=media&token=f494b26e-d748-47f5-b349-0f207899bd74"
          alt="Logo"
          className="logo"
        />
        <h1>Bintang Jaya</h1>
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Masukkan email @bintang.jaya"
            onChange={handleInputChange}
            required
            autoComplete="email"
            aria-label="Email"
          />
          <EmailIcon className="icon" />
        </div>
        <div className="input-box">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Masukkan password"
            name="password"
            onChange={handleInputChange}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
          <PasswordIcon className="icon" />
          {passwordVisible ? (
            <VisibilityOffIcon
              className="icon toggle-icon"
              onClick={() => setPasswordVisible(false)}
            />
          ) : (
            <VisibilityIcon
              className="icon toggle-icon"
              onClick={() => setPasswordVisible(true)}
            />
          )}
        </div>
        <button type="submit">Masuk</button>
        {error && <span>Salah Email / Password</span>}
      </form>
    </div>
  );
};

export default Login;
