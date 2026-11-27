import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useShop();
  const [selectedSize, setSelectedSize] = useState('M');

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  
  const prodId = product._id || product.id;
  const wishlisted = isInWishlist(prodId);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${prodId}`} className="product-image-link">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-img"
            loading="lazy" 
          />
        </Link>

        <div className="product-badges">
          {discountPercent > 0 && (
            <span className="badge badge-discount">-{discountPercent}%</span>
          )}
          {product.isNew && (
            <span className="badge badge-new">New</span>
          )}
        </div>

        <button 
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={wishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
        >
          {wishlisted ? <FaHeart className="heart-icon filled" /> : <FiHeart className="heart-icon" />}
        </button>

        <div className="product-quick-actions">
          <Link to={`/product/${prodId}`} className="quick-view-btn">
            <FiEye size={16} /> View Details
          </Link>
        </div>
      </div>

      <div className="product-content">
        <div className="product-meta">
          <span className="product-category">{product.category.toUpperCase()}</span>
          
          <div className="product-rating" title={`${product.rating} stars out of 5`}>
            <FiStar className="star-icon" />
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.reviewsCount || product.reviews || 0})</span>
          </div>
        </div>

        <h3 className="product-name">
          <Link to={`/product/${prodId}`}>{product.name}</Link>
        </h3>

        <div className="product-pricing">
          <span className="current-price">{formatPrice(product.price)}</span>
          <span className="original-price">{formatPrice(product.originalPrice)}</span>
          <span className="savings-badge">Save {formatPrice(product.originalPrice - product.price)}</span>
        </div>

        <div className="product-size-row">
          <span className="size-label">Size:</span>
          <div className="size-buttons">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-mini-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="add-to-cart-btn"
          onClick={handleQuickAdd}
        >
          <FiShoppingBag className="cart-btn-icon" />
          <span>Add to Bag ({selectedSize})</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
