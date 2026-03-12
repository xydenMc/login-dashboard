import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // LOGIN PAKAI SUPABASE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // AMBIL DATA USER DARI TABEL (TERMASUK ROLE!)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nama_lengkap, role') // <-- AMBIL NAMA DAN ROLE
        .eq('email', email)
        .maybeSingle();

      console.log("📦 Data user dari tabel:", userData); // DEBUG

      // SIMPAN DATA KE LOCALSTORAGE
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("email", email);
      
      if (userData?.nama_lengkap) {
        localStorage.setItem("nama_lengkap", userData.nama_lengkap);
      } else {
        localStorage.setItem("nama_lengkap", email.split('@')[0]);
      }

      // ===== PENTING! SIMPAN ROLE =====
      if (userData?.role) {
        localStorage.setItem("role", userData.role);
        console.log("🎯 Role disimpan:", userData.role);
      } else {
        localStorage.setItem("role", "customer"); // DEFAULT
        console.log("🎯 Role default (customer)");
      }

      console.log("✅ LocalStorage setelah login:");
      console.log("- role:", localStorage.getItem("role"));
      console.log("- email:", localStorage.getItem("email"));
      console.log("- nama:", localStorage.getItem("nama_lengkap"));

      if (onLogin) onLogin();
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="split-layout">
        <div className="welcome-section">
          <h1 className="welcome-title">Selamat Datang</h1>
          <p className="welcome-subtitle">di Toko Gerabah</p>
          <div className="welcome-line"></div>
        </div>

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

            <div className="register-link">
              <p>
                Belum punya akun? <Link to="/register">Daftar disini</Link>
              </p>
            </div>

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