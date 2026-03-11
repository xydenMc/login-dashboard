import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import DeleteModal from "../components/DeleteModal";
import "./Dashboard.css";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [mode, setMode] = useState("add");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    
    const userEmail = localStorage.getItem("email");
    const userNama = localStorage.getItem("nama_lengkap");
    setEmail(userEmail || "");
    setNamaLengkap(userNama || userEmail?.split('@')[0] || "");
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id_produk', { ascending: false });
      
      if (error) throw error;
      
      // Format data sesuai struktur tabel
      const formattedProducts = data?.map(item => ({
        id_produk: item.id_produk,
        nama_produk: item.nama_produk,
        deskripsi: item.deskripsi,
        kategori: item.kategori,
        harga: item.harga,
        stok: item.stok,
        status: item.status,
        id_kategori: item.id_kategori
      })) || [];
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nama_lengkap");
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddProduct = () => {
    setMode("add");
    setSelectedProduct(null);
    setShowProductModal(true);
    setShowDropdown(false);
  };

  const handleEditProduct = (product) => {
    setMode("edit");
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteClick = () => {
    if (selectedProducts.length === 0) {
      alert("Pilih produk yang ingin dihapus");
      return;
    }
    setShowDeleteModal(true);
    setShowDropdown(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id_produk', selectedProducts);

      if (error) throw error;
      
      setSelectedProducts([]);
      fetchProducts();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Gagal menghapus produk");
    }
  };

  const handleProductSaved = () => {
    fetchProducts();
    setShowProductModal(false);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id_produk));
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Dashboard Produk</h1>
        <div className="user-info">
          <span>Halo, {namaLengkap}!</span>
          <div className="dropdown-container">
            <button 
              onClick={toggleDropdown} 
              className="dropdown-btn"
              type="button"
            >
              ☰
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleAddProduct}>Tambah Produk</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {selectedProducts.length > 0 && (
        <div className="selection-bar">
          <span>{selectedProducts.length} produk dipilih</span>
          <button onClick={toggleSelectAll} type="button">
            {selectedProducts.length === products.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </button>
          <button onClick={handleDeleteClick} className="delete-selected" type="button">
            Hapus {selectedProducts.length} produk
          </button>
        </div>
      )}

      <div className="products-grid">
        {loading ? (
          <p>Loading produk...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id_produk} className="product-wrapper">
              {selectedProducts.length > 0 && (
                <input
                  type="checkbox"
                  className="product-checkbox"
                  checked={selectedProducts.includes(product.id_produk)}
                  onChange={() => toggleProductSelection(product.id_produk)}
                />
              )}
              <ProductCard
                product={product}
                onEdit={() => handleEditProduct(product)}
                showEdit={selectedProducts.length === 0}
              />
            </div>
          ))
        ) : (
          <p>Tidak ada produk</p>
        )}
      </div>

      {showProductModal && (
        <ProductModal
          mode={mode}
          product={selectedProduct}
          onClose={() => setShowProductModal(false)}
          onSave={handleProductSaved}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          count={selectedProducts.length}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;