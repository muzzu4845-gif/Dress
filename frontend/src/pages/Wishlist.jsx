import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Wishlist = () => {
  const { wishlist, wishlistCount } = useShop();

  if (wishlistCount === 0) {
    return (
      <div className="section-container empty-wishlist-page">
        <div className="empty-cart-card">
          <div className="empty-icon-wrapper">
            <FiHeart size={56} />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>
            Explore our contemporary drops and save your favorite garments for later.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Explore Collection <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="section-container">
        <div className="wishlist-header-bar">
          <div>
            <span className="section-badge">Saved Garments</span>
            <h1 className="wishlist-title">My Wishlist ({wishlistCount})</h1>
            <p className="wishlist-subtitle">Items you've bookmarked for your curated capsule wardrobe.</p>
          </div>
          <Link to="/shop" className="btn btn-outline continue-btn">
            Explore More Items <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
