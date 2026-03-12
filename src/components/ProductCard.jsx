import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

function ProductCard({ product, onEdit, showEdit, isAdmin }) { // <-- TERIMA PROPS ISADMIN
  const [showDetail, setShowDetail] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id_produk,
    nama_produk,
    kategori,
    harga,
    stok,
    status,
    gambar
  } = product;

  // UNSWASH IMAGES
  const unswashImages = [
    "https://images.unsplash.com/photo-1578301978018-300d7f8c7e3b?w=400",
    "https://images.unsplash.com/photo-1507488557502-e3b5c7a51e1f?w=400",
    "https://images.unsplash.com/photo-1562099601-2551d7d09f8f?w=400",
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400",
    "https://images.unsplash.com/photo-1544984241-5d5c6b9a89cf?w=400"
  ];

  const defaultImage = unswashImages[id_produk % unswashImages.length];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'tersedia':
        return '#2fc145';
      case 'nonaktif':
        return '#6c757d';
      case 'habis':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'tersedia':
        return 'TERSEDIA';
      case 'nonaktif':
        return 'NONAKTIF';
      case 'habis':
        return 'HABIS';
      default:
        return status || 'TERSEDIA';
    }
  };

  return (
    <>
      <div className="product-card" onClick={() => setShowDetail(true)}>
        {/* TOMBOL EDIT - HANYA UNTUK ADMIN */}
        {isAdmin && showEdit && (
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
            src={!imageError && gambar ? gambar : defaultImage}
            alt={nama_produk}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',  // GANTI DARI 'cover' KE 'contain'
              backgroundColor: '#f5f5f5',
              padding: '10px'  // TAMBAH PADDING biar ga nempel
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
            <p className="product-stock">
              Stok: {stok !== undefined && stok !== null ? stok : 0}
            </p>
            <span
              className="product-status"
              data-status={status?.toLowerCase()}
              style={{ backgroundColor: getStatusColor(status) }}
            >
              {getStatusText(status)}
            </span>
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