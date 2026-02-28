import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";

function Register({ onRegister }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      // HAPUS 'const response =' karena tidak dipakai
      await axios.post(
        "http://localhost:5000/auth/register",
        {
          nama_lengkap: namaLengkap,
          email: email,
          password: password
        }
      );

      setSuccessMessage("Registrasi berhasil! Mengalihkan ke login...");
      
      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registrasi gagal, silakan coba lagi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="split-layout">
        {/* Bagian Kiri - Selamat Datang */}
        <div className="welcome-section">
          <h1 className="welcome-title">Bergabunglah</h1>
          <p className="welcome-subtitle">dengan Toko Gerabah</p>
          <div className="welcome-line"></div>
          <p className="welcome-description">
            Daftar sekarang untuk menikmati berbagai produk gerabah berkualitas
          </p>
        </div>

        {/* Bagian Kanan - Form Register */}
        <div className="form-section">
          <div className="register-card">
            <h2 className="form-header">Daftar Akun</h2>
            
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label>NAMA LENGKAP</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  required
                />
              </div>

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
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>KONFIRMASI PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? "MEMBUAT AKUN..." : "DAFTAR"}
              </button>
            </form>

            <div className="login-link">
              <p>
                Sudah punya akun? <Link to="/">Login disini</Link>
              </p>
            </div>

            <div className="register-footer">
              <div className="footer-line"></div>
              <p className="footer-text">© 2026 Toko Gerabah</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;