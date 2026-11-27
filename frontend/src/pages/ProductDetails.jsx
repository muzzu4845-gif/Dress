import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingBag, 
  FiStar, 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiPlus, 
  FiMinus, 
  FiChevronRight,
  FiShare2,
  FiCheck
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, formatPrice, showToast } = useShop();

  const product = products.find(
    (p) => String(p._id || p.id) === String(id)
  );

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize('M');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="section-container product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been archived.</p>
        <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const wishlisted = isInWishlist(productId);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const relatedProducts = products
    .filter(
      (p) =>
        String(p._id || p.id) !== String(productId) &&
        (p.category === product.category || p.gender === product.gender)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="product-details-page">
      <div className="section-container breadcrumbs">
        <Link to="/">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/shop">Shop</Link>
        <FiChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`}>{product.category.toUpperCase()}</Link>
        <FiChevronRight size={14} />
        <span className="current-crumb">{product.name}</span>
      </div>

      <div className="section-container product-main-wrapper">
        <div className="product-gallery">
          <div className="gallery-thumbnails">
            {(product.images || [product.image]).map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="main-image-display">
            <img 
              src={selectedImage || product.image} 
              alt={product.name} 
              className="featured-display-img"
            />
            {discountPercent > 0 && (
              <span className="details-discount-badge">{discountPercent}% OFF</span>
            )}
          </div>
        </div>

        <div className="product-buy-panel">
          <div className="category-meta-row">
            <span className="product-category-tag">{product.category.toUpperCase()}</span>
            <button className="share-btn" onClick={handleShare} title="Share item">
              <FiShare2 size={16} /> Share
            </button>
          </div>

          <h1 className="details-product-title">{product.name}</h1>

          <div className="details-rating-row">
            <div className="stars-pill">
              <FiStar className="star-icon-filled" />
              <strong>{product.rating}</strong>
            </div>
            <span className="review-count-text">Based on {product.reviewsCount || product.reviews || 0} customer reviews</span>
            <span className="stock-status">In Stock</span>
          </div>

          <div className="details-pricing-card">
            <div className="price-stack">
              <span className="details-price">{formatPrice(product.price)}</span>
              <span className="details-orig-price">{formatPrice(product.originalPrice)}</span>
              <span className="details-savings">
                You Save {formatPrice(product.originalPrice - product.price)} ({discountPercent}% OFF)
              </span>
            </div>
            <p className="tax-inclusive-note">Inclusive of all taxes & duties</p>
          </div>

          <p className="details-description">{product.description}</p>

          <div className="size-selector-block">
            <div className="size-selector-header">
              <span className="selector-title">Select Size: <strong>{selectedSize}</strong></span>
              <span className="size-guide-link">Standard Indian / Global Fit</span>
            </div>
            <div className="size-options-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-select-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="purchase-action-row">
            <div className="quantity-picker">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <FiMinus size={16} />
              </button>
              <span className="quantity-num">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <FiPlus size={16} />
              </button>
            </div>

            <button 
              className="btn btn-primary add-to-bag-button"
              onClick={handleAddToCart}
            >
              <FiShoppingBag size={20} />
              <span>Add to Bag</span>
            </button>

            <button 
              className={`details-wishlist-toggle ${wishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist toggle"
              title={wishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
            >
              {wishlisted ? <FaHeart className="filled-heart" size={20} /> : <FiHeart size={20} />}
            </button>
          </div>

          <div className="details-perks-box">
            <div className="perk-row">
              <FiTruck className="perk-icon" />
              <div>
                <strong>Express Delivery Across India</strong>
                <span>Dispatches in 24 hours. Delivery in 2–4 business days.</span>
              </div>
            </div>
            <div className="perk-row">
              <FiRefreshCw className="perk-icon" />
              <div>
                <strong>30-Day Easy Exchanges & Returns</strong>
                <span>Doorstep pickup with immediate replacement or refund.</span>
              </div>
            </div>
            <div className="perk-row">
              <FiShield className="perk-icon" />
              <div>
                <strong>100% Authentic Quality Guaranteed</strong>
                <span>Crafted from certified organic and sustainably sourced textiles.</span>
              </div>
            </div>
          </div>

          <div className="details-tabs-accordion">
            <div className="accordion-header">
              <h4>Fabric Composition & Garment Care</h4>
            </div>
            <ul className="details-bullet-list">
              {product.details?.map((detail, index) => (
                <li key={index}>
                  <FiCheck className="bullet-check" size={16} />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-container">
            <div className="section-header">
              <div className="section-badge">Complete Your Look</div>
              <h2 className="section-title">You Might Also Adore</h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
