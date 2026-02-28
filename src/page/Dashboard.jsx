import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Dashboard.css";

function Dashboard() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const userEmail = localStorage.getItem("email"); // Ubah dari username
        setEmail(userEmail);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    // Data produk contoh
    const products = [
        { id: 1, title: "Pemrograman Web React", author: "John Doe", price: 150000 },
        { id: 2, title: "Belajar JavaScript Modern", author: "Jane Smith", price: 120000 },
        { id: 3, title: "Database untuk Pemula", author: "Bob Johnson", price: 100000 },
        { id: 4, title: "UI/UX Design Fundamental", author: "Alice Brown", price: 180000 },
        { id: 5, title: "Mobile Development", author: "Charlie Wilson", price: 200000 },
        { id: 6, title: "Artificial Intelligence", author: "Diana Prince", price: 250000 },
    ];

    return (
        <div className="dashboard">
            <nav className="navbar">
                <h1>Dashboard Produk</h1>
                <div className="user-info">
                   <span>Halo, {email}!</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        author={product.author}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;