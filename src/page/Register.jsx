import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "./Register.css";

function Register() {
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

    try {
      // 1. Daftar ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nama_lengkap: namaLengkap, // Ini akan tersimpan di auth.users
          }
        }
      });

      if (authError) throw authError;

      // 2. Simpan data ke tabel users (TANPA PASSWORD!)
      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              email: email,
              nama_lengkap: namaLengkap,
              role: 'customer'
              // JANGAN simpan password di sini!
            }
          ]);

        if (userError) {
          console.log("Error insert ke tabel users:", userError);
          // Tetap lanjut meskipun error, karena auth sudah sukses
        }
      }

      setSuccessMessage("Registrasi berhasil! Silakan cek email untuk verifikasi.");

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (error) {
      setErrorMessage(error.message);
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