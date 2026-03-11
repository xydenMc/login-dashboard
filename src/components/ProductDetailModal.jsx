import { useState } from "react";
import "./ProductDetailModal.css";

function ProductDetailModal({ product, onClose }) {
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState("");
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

  const totalHarga = harga * jumlah;
  
  const defaultImage = "https://via.placeholder.com/400x300?text=Toko+Gerabah";
  const imageUrl = (gambar && !imageError) ? gambar : defaultImage;

  const handleBeli = () => {
    alert(`Anda membeli ${jumlah} ${nama_produk}\nTotal: Rp ${totalHarga.toLocaleString('id-ID')}\nCatatan: ${catatan || '-'}`);
    onClose();
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'aktif': return '#28a745';
      case 'nonaktif': return '#dc3545';
      case 'habis': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="detail-content">
          <div className="detail-image">
            <img 
              src={imageUrl}
              alt={nama_produk}
              onError={() => setImageError(true)}
            />
          </div>

          <div className="detail-info">
            <h2>{nama_produk}</h2>
            
            {kategori && (
              <p className="detail-category">
                Kategori: <span className="category-badge">{kategori}</span>
              </p>
            )}
            
            <p className="detail-price">Rp {harga?.toLocaleString('id-ID')}</p>
            
            <div className="detail-stock">
              <span>Stok: {stok}</span>
              <span 
                className="product-status" 
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {status}
              </span>
            </div>
            
            {deskripsi && (
              <div className="detail-description">
                <h4>Deskripsi:</h4>
                <p>{deskripsi}</p>
              </div>
            )}

            <div className="buy-section">
              <h4>Beli Produk</h4>
              
              <div className="jumlah-control">
                <label>Jumlah:</label>
                <div className="jumlah-input">
                  <button 
                    type="button"
                    onClick={() => setJumlah(prev => Math.max(1, prev - 1))}
                    disabled={jumlah <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={stok}
                  />
                  <button 
                    type="button"
                    onClick={() => setJumlah(prev => Math.min(stok, prev + 1))}
                    disabled={jumlah >= stok}
                  >
                    +
                  </button>
                </div>
                <span className="stok-tersedia">Stok tersedia: {stok}</span>
              </div>

              <div className="catatan-control">
                <label>Catatan (opsional):</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: warna, ukuran, pesan khusus"
                  rows="2"
                />
              </div>

              <div className="total-harga">
                <span>Total Harga:</span>
                <span className="total-nominal">Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>

              <button 
                className="buy-now-btn"
                onClick={handleBeli}
                disabled={stok === 0 || status === 'nonaktif' || status === 'habis'}
              >
                {stok === 0 || status === 'habis' ? 'Stok Habis' : 'Beli Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;