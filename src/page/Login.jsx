// Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);
      if (onLogin) onLogin();
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="split-layout">
        {/* Bagian Kiri: Selamat Datang */}
        <div className="welcome-section">
          <h1 className="welcome-title">Selamat Datang</h1>
          <p className="welcome-subtitle">di Toko Gerabah</p>
          <div className="welcome-line"></div>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="form-section">
          <div className="login-card">
            <h2 className="form-header">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "LOADING..." : "LOGIN"}
              </button>
            </form>

            <div className="login-footer">
              <div className="footer-line"></div>
              <p className="footer-text">© 2026 Toko Gerabah</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;