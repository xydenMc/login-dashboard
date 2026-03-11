import { useState } from "react";
import { supabase } from "../supabase"; // IMPORT SUPABASE
import "./ProductDetailModal.css";

function ProductDetailModal({ product, onClose }) {
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState("");
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false); // TAMBAH STATE LOADING
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const {
    id_produk, // <-- PENTING! BUTUH ID PRODUK
    nama_produk,
    deskripsi,
    kategori,
    harga,
    stok,
    status,
    gambar
  } = product;

  const totalHarga = harga * jumlah;
  
  const imageUrl = (!imageError && gambar) 
    ? gambar 
    : "https://images.unsplash.com/photo-1578301978018-300d7f8c7e3b?w=400";

  // FUNGSI NOTIFIKASI
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

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

  // ===== FUNGSI BELI DENGAN PENGURANGAN STOK =====
  const handleBeli = async () => {
    if (jumlah > stok) {
      showNotification(`Stok tidak cukup! Stok tersedia: ${stok}`, 'error');
      return;
    }

    setLoading(true);

    try {
      // 1. Hitung stok baru
      const stokBaru = stok - jumlah;
      
      // 2. Tentukan status baru (jika stok habis)
      const statusBaru = stokBaru === 0 ? 'habis' : status;

      // 3. Update ke database
      const { error } = await supabase
        .from('products')
        .update({ 
          stok: stokBaru,
          status: statusBaru
        })
        .eq('id_produk', id_produk);

      if (error) throw error;

      // 4. Notifikasi sukses
      showNotification(
        `✅ Berhasil membeli ${jumlah} ${nama_produk}\nTotal: Rp ${totalHarga.toLocaleString('id-ID')}`,
        'success'
      );

      // 5. Tutup modal setelah 1.5 detik
      setTimeout(() => {
        onClose();
        // Refresh data di dashboard (panggil ulang fetchProducts)
        window.location.reload(); // Simple, atau pake callback
      }, 1500);

    } catch (error) {
      console.error("Error buying product:", error);
      showNotification("❌ Gagal melakukan pembelian", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* NOTIFIKASI */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="detail-content">
          <div className="detail-image">
            <img 
              src={imageUrl}
              alt={nama_produk}
              onError={() => setImageError(true)}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
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
              <span>Stok: {stok !== undefined && stok !== null ? stok : 0}</span>
              <span 
                className="product-status" 
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {getStatusText(status)}
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
                    disabled={jumlah <= 1 || loading}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={stok || 0}
                    disabled={loading}
                  />
                  <button 
                    type="button"
                    onClick={() => setJumlah(prev => Math.min(stok || 0, prev + 1))}
                    disabled={jumlah >= (stok || 0) || loading}
                  >
                    +
                  </button>
                </div>
                <span className="stok-tersedia">Stok tersedia: {stok || 0}</span>
              </div>

              <div className="catatan-control">
                <label>Catatan (opsional):</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: warna, ukuran, pesan khusus"
                  rows="2"
                  disabled={loading}
                />
              </div>

              <div className="total-harga">
                <span>Total Harga:</span>
                <span className="total-nominal">Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>

              <button 
                className="buy-now-btn"
                onClick={handleBeli}
                disabled={stok === 0 || status === 'nonaktif' || status === 'habis' || loading}
              >
                {loading ? "Memproses..." : 
                 stok === 0 || status === 'habis' ? 'Stok Habis' : 
                 status === 'nonaktif' ? 'Tidak Tersedia' : 'Beli Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;