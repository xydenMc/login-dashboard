import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ProductCard from "../components/ProductCard";
import "./Dashboard.css";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    
    const userEmail = localStorage.getItem("email");
    setEmail(userEmail || "");
    
    // AMBIL DATA PRODUK DARI SUPABASE
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nama_lengkap");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Dashboard Produk</h1>
        <div className="user-info">
          <span>Halo, {email}!</span>
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            type="button"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="products-grid">
        {loading ? (
          <p>Loading produk...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title || product.nama_produk}
              author={product.author || product.penulis}
              price={product.price || product.harga}
              image={product.image_url || product.gambar}
            />
          ))
        ) : (
          <p>Tidak ada produk</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;