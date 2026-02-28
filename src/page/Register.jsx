import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        // Validasi password match
        if (password !== confirmPassword) {
            setErrorMessage("Password tidak cocok");
            setLoading(false);
            return;
        }

        // Validasi panjang password minimal 6 karakter
        if (password.length < 6) {
            setErrorMessage("Password minimal 6 karakter");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/auth/register",
                {
                    nama_lengkap: namaLengkap,
                    email: email,
                    password: password
                }
            );

            setSuccessMessage("Registrasi berhasil! Mengalihkan ke login...");

            // Simpan token jika ingin langsung login
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("nama_lengkap", response.data.user.nama_lengkap);

            // Panggil onRegister jika ada
            if (onRegister) onRegister();

            // Redirect ke dashboard atau login
            setTimeout(() => {
                navigate("/dashboard"); // atau "/login" jika ingin ke halaman login
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

                        <div className="register-footer">
                            <div className="footer-line"></div>
                            <p className="footer-text">
                                Sudah punya akun? <Link to="/">Login disini</Link>
                            </p>
                            <p className="footer-text">© 2026 Toko Gerabah</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;