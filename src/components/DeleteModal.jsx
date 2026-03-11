import "./DeleteModal.css";

function DeleteModal({ count, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <h2>Hapus Produk</h2>
        <p>Anda akan menghapus {count} produk. Yakin ingin melanjutkan?</p>
        
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">
            Batal
          </button>
          <button onClick={onConfirm} className="delete-btn">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;