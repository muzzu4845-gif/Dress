import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>Spring / Summer 2026 Collection</span>
          </div>
          
          <h1 className="hero-title">
            Upgrade Your <span className="title-serif">Style</span>
          </h1>
          
          <p className="hero-subtitle">
            Discover the latest trends in fashion. Tailored minimalist aesthetics, 
            premium organic fabrics, and modern essentials created for the discerning wardrobe.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary hero-btn">
              Shop Now <FiArrowRight className="btn-icon" />
            </Link>
            <Link to="/shop?category=t-shirts" className="btn btn-secondary hero-btn">
              Explore T-Shirts
            </Link>
          </div>

          <div className="hero-trust-bar">
            <div className="trust-item">
              <FiTruck className="trust-icon" />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹1,999</span>
              </div>
            </div>
            <div className="trust-item">
              <FiRefreshCw className="trust-icon" />
              <div>
                <strong>30-Day Returns</strong>
                <span>Hassle-free exchanges</span>
              </div>
            </div>
            <div className="trust-item">
              <FiShield className="trust-icon" />
              <div>
                <strong>100% Authentic</strong>
                <span>Guaranteed quality</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper primary-image">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop" 
              alt="STYLEHUB High Fashion Editorial" 
              className="hero-img"
            />
            <div className="hero-image-overlay"></div>
            
            <div className="floating-card top-card">
              <span className="tag-label">Exclusive Edition</span>
              <p className="tag-title">Contemporary Silhouettes</p>
              <span className="tag-price">From ₹1,199</span>
            </div>

            <div className="floating-card bottom-card">
              <div className="rating-pill">
                <span className="star">★</span> 4.9 Rating
              </div>
              <p className="review-stat">Loved by 25,000+ style enthusiasts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
