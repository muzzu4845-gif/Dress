import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';
import { FiArrowRight, FiFeather, FiPackage, FiRefreshCw, FiClock } from 'react-icons/fi';
import '../styles/index.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />

      <section className="features-ribbon">
        <div className="section-container">
          <div className="ribbon-grid">
            <div className="ribbon-card">
              <div className="ribbon-icon-wrap"><FiFeather size={24} /></div>
              <h4>Organic Craftsmanship</h4>
              <p>Heavyweight sustainable combed fabrics tailored for enduring comfort.</p>
            </div>
            <div className="ribbon-card">
              <div className="ribbon-icon-wrap"><FiPackage size={24} /></div>
              <h4>Luxury Eco Packaging</h4>
              <p>Minimal, recyclable presentation boxes crafted with recycled elements.</p>
            </div>
            <div className="ribbon-card">
              <div className="ribbon-icon-wrap"><FiRefreshCw size={24} /></div>
              <h4>30-Day Guaranteed Returns</h4>
              <p>Complimentary doorstep pickups and immediate online refunds.</p>
            </div>
            <div className="ribbon-card">
              <div className="ribbon-icon-wrap"><FiClock size={24} /></div>
              <h4>24/7 Concierge Support</h4>
              <p>Dedicated styling advisors ready to help with sizing and queries.</p>
            </div>
          </div>
        </div>
      </section>

      <Categories />

      <FeaturedProducts />

      <section className="editorial-banner">
        <div className="editorial-container">
          <div className="editorial-content">
            <span className="editorial-badge">Atelier Perspective</span>
            <h2 className="editorial-title">
              Designed For The <br />
              <em>Modern Minimalist</em>
            </h2>
            <p className="editorial-text">
              We strip away unnecessary ornament to focus solely on silhouette, 
              drape, and architectural simplicity. Clothing engineered to transition 
              seamlessly from everyday leisure to elevated evenings.
            </p>
            <div className="editorial-buttons">
              <Link to="/shop" className="btn btn-primary">
                Explore The Lookbook <FiArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="editorial-visual">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop" 
              alt="Editorial model in luxury minimal clothing"
              className="editorial-image"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;
