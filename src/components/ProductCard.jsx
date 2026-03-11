import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

function ProductCard({ product, onEdit, showEdit }) {
  const [showDetail, setShowDetail] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { 
    nama_produk, 
    deskripsi, 
    kategori, 
    harga, 
    stok, 
    status,
    gambar 
  } = product;

  console.log("Product card - nama:", nama_produk, "gambar:", gambar);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'aktif': return '#28a745';
      case 'nonaktif': return '#dc3545';
      case 'habis': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getImageUrl = () => {
    if (!gambar || imageError) {
      return "https://via.placeholder.com/300x200?text=Toko+Gerabah";
    }
    return gambar;
  };

  return (
    <>
      <div className="product-card" onClick={() => setShowDetail(true)}>
        {showEdit && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }} 
            className="edit-btn"
          >
            ✏️
          </button>
        )}
        <div className="product-image">
          <img 
            src={getImageUrl()}
            alt={nama_produk}
            onError={(e) => {
              console.log("Error loading image:", gambar);
              setImageError(true);
              e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading";
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{nama_produk}</h3>
          
          {kategori && (
            <p className="product-category">
              <span className="category-badge">{kategori}</span>
            </p>
          )}
          
          <p className="product-price">Rp {harga?.toLocaleString('id-ID')}</p>
          
          <div className="product-meta">
            {stok !== undefined && (
              <p className="product-stock">Stok: {stok}</p>
            )}
            {status && (
              <span 
                className="product-status" 
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {status}
              </span>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <ProductDetailModal
          product={product}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default ProductCard;