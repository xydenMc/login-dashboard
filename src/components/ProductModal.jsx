import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./ProductModal.css";

function ProductModal({ mode, product, onClose, onSave }) {
  const [nama_produk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [status, setStatus] = useState("aktif");
  const [gambarUrl, setGambarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (mode === "edit" && product) {
      setNamaProduk(product.nama_produk || "");
      setDeskripsi(product.deskripsi || "");
      setKategori(product.kategori || "");
      setHarga(product.harga || "");
      setStok(product.stok || "");
      setStatus(product.status || "aktif");
      setGambarUrl(product.gambar || "");
    }
  }, [mode, product]);

  // Fungsi notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        nama_produk,
        deskripsi,
        kategori,
        harga: parseInt(harga),
        stok: stok ? parseInt(stok) : 0, // PASTIKAN STOK ANGKA
        status,
        gambar: gambarUrl || null
      };

      console.log("Data yang akan disimpan:", productData);

      if (mode === "add") {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        showNotification("✅ Produk berhasil ditambahkan!", 'success');
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id_produk', product.id_produk);

        if (error) throw error;
        showNotification("✅ Produk berhasil diupdate!", 'success');
      }

      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error("❌ Error:", error);
      showNotification("❌ Gagal: " + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id_produk', product.id_produk);

      if (error) throw error;
      
      showNotification("✅ Produk berhasil dihapus!", 'success');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("❌ Gagal menghapus: " + error.message, 'error');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const previewUrl = (!imageError && gambarUrl) 
    ? gambarUrl 
    : "https://images.unsplash.com/photo-1578301978018-300d7f8c7e3b?w=400";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* NOTIFIKASI HALUS */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="modal-header">
          <h2>{mode === "add" ? "Tambah Produk" : "Edit Produk"}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Produk *</label>
            <input
              type="text"
              value={nama_produk}
              onChange={(e) => setNamaProduk(e.target.value)}
              required
              placeholder="Masukkan nama produk"
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Masukkan kategori"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Harga *</label>
              <input
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                required
                placeholder="0"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Stok *</label>
              <input
                type="number"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                required
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* BAGIAN INPUT URL GAMBAR */}
          <div className="form-group">
            <label>URL Gambar</label>
            <input
              type="url"
              value={gambarUrl}
              onChange={(e) => {
                setGambarUrl(e.target.value);
                setImageError(false);
              }}
              placeholder="https://images.unsplash.com/photo-xxxx"
              className="url-input"
            />
            <div className="upload-info">
              <span>Masukkan URL gambar (dari Google Images, Unsplash, dll)</span>
            </div>
            
            {gambarUrl && (
              <div className="image-preview-container">
                <img 
                  src={previewUrl}
                  alt="Preview" 
                  className="image-preview"
                  onError={() => setImageError(true)}
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
                {imageError && (
                  <div className="preview-error" style={{color: 'red', marginTop: '5px'}}>
                    URL tidak valid, pakai preview default
                  </div>
                )}
                <button 
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setGambarUrl("");
                    setImageError(false);
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows="4"
              placeholder="Masukkan deskripsi produk"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="habis">Habis</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Batal
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Menyimpan..." : (mode === "add" ? "Tambah Produk" : "Update Produk")}
            </button>
          </div>

          {mode === "edit" && (
            <>
              <div className="delete-section">
                <button 
                  type="button"
                  className="delete-product-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  🗑️ Hapus Produk
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                  <div className="delete-confirm-modal">
                    <p>Yakin ingin menghapus produk <strong>{nama_produk}</strong>?</p>
                    <div className="confirm-actions">
                      <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Batal
                      </button>
                      <button 
                        type="button"
                        className="delete-confirm-btn"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        {loading ? "Menghapus..." : "Ya, Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProductModal;