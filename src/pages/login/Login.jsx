import { useContext, useState } from "react";
import "./login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/logo-bintang-jaya.png?alt=media&token=f494b26e-d748-47f5-b349-0f207899bd74"
          alt="Logo"
          className="logo"
        />
        <h1>Masuk</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Masukkan email @bintang.jaya"
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email"
          />
          <EmailIcon className="icon"/>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Masukkan password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
          <PasswordIcon className="icon"/>
        </div>
        <button type="submit">Login</button>
        {error && <span>Wrong Email or Password</span>}
      </form>
    </div>
  );
};

export default Login;
