function ProductCard({ title, author, price }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={`https://via.placeholder.com/200x150?text=${title.charAt(0)}`} 
          alt={title}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-author">Penulis: {author}</p>
        <p className="product-price">{formatPrice(price)}</p>
        <button className="buy-button">Beli Sekarang</button>
      </div>
    </div>
  );
}

export default ProductCard;
