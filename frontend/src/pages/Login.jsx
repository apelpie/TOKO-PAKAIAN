// Login.jsx 
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      username,
      password,
    });

    const { accessToken, user } = response.data;
    if (accessToken && user) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("name", user.name); 
      localStorage.setItem("role", user.role); 
      alert(`Login Berhasil! Selamat datang ${user.name}`);
      navigate("/dashboard");
    
      window.location.reload();
    }
  } catch (error) {
    const pesan = error.response?.data?.pesan || "Login Gagal";
    alert(pesan);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Daphne's</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login-submit">Login</button>
        </form>
      </div>
    </div>
  );
}
export default Login;