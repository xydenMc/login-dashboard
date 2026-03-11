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
  const [gambar, setGambar] = useState(null);
  const [gambarPreview, setGambarPreview] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("File harus berupa gambar");
        return;
      }
      setGambar(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!gambar) return gambarUrl;

    const fileExt = gambar.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log("========== UPLOAD PROCESS ==========");
    console.log("1. File name:", gambar.name);
    console.log("2. File size:", gambar.size, "bytes");
    console.log("3. Upload path:", filePath);

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, gambar, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("❌ UPLOAD ERROR:", uploadError);
      throw uploadError;
    }

    console.log("✅ Upload success");

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log("4. Public URL dari Supabase:", data.publicUrl);
    
    // FIX URL: Ganti typo kalau ada
    let finalUrl = data.publicUrl;
    if (finalUrl.includes('mesypcwzvyauoamisfnv')) {
      finalUrl = finalUrl.replace('mesypcwzvyauoamisfnv', 'mesypcwzvyauoamsifnv');
      console.log("5. URL setelah fix typo:", finalUrl);
    }
    
    console.log("6. Final URL yang akan disimpan:", finalUrl);
    console.log("====================================");
    
    return finalUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const uploadedImageUrl = await uploadImage();
      setUploadProgress(70);

      const productData = {
        nama_produk,
        deskripsi,
        kategori,
        harga: parseInt(harga),
        stok: stok ? parseInt(stok) : null,
        status,
        gambar: uploadedImageUrl || null
      };

      console.log("Data yang akan disimpan:", productData);

      setUploadProgress(80);

      if (mode === "add") {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert("✅ Produk berhasil ditambahkan!");
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id_produk', product.id_produk);

        if (error) throw error;
        alert("✅ Produk berhasil diupdate!");
      }

      setUploadProgress(100);
      onSave();
    } catch (error) {
      console.error("❌ ERROR SAVING PRODUCT:", error);
      alert("Gagal menyimpan produk: " + error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (product.gambar) {
        const fileName = product.gambar.split('/').pop();
        await supabase.storage
          .from('product-images')
          .remove([`products/${fileName}`]);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id_produk', product.id_produk);

      if (error) throw error;
      
      alert("✅ Produk berhasil dihapus!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk: " + error.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <label>Stok</label>
              <input
                type="number"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gambar Produk</label>
            <div className="upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <div className="upload-info">
                <span>Format: JPG, PNG, GIF (max 2MB)</span>
              </div>
            </div>
            
            {(gambarPreview || gambarUrl) && (
              <div className="image-preview-container">
                <img 
                  src={gambarPreview || gambarUrl} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button 
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setGambar(null);
                    setGambarPreview("");
                    setGambarUrl("");
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span>{uploadProgress}%</span>
            </div>
          )}

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