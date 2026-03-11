import { useState } from "react";

function ProductCard({ title, author, price, image }) {
  const [imageError, setImageError] = useState(false);

  const handleBuyClick = (e) => {
    e.preventDefault();
    alert(`Anda membeli: ${title}`);
  };

  // Pakai gambar dari database atau fallback
  const imageUrl = image && !imageError 
    ? image 
    : 'https://via.placeholder.com/200x150?text=No+Image';

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageUrl}
          alt={title}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-author">Penulis: {author}</p>
        <p className="product-price">Rp {price?.toLocaleString('id-ID')}</p>
        <button 
          className="buy-button"
          onClick={handleBuyClick}
          type="button"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}

export default ProductCard;