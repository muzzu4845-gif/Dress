import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { useShop } from '../context/ShopContext';
import '../styles/Products.css';

const FeaturedProducts = () => {
  const { products } = useShop();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { label: 'All Items', value: 'all' },
    { label: "Men", value: 'men' },
    { label: "Women", value: 'women' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Hoodies', value: 'hoodies' }
  ];

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'men') return p.gender === 'men' || p.category === 'men';
    if (activeFilter === 'women') return p.gender === 'women' || p.category === 'women';
    return p.category === activeFilter;
  });

  return (
    <section className="featured-section">
      <div className="section-container">
        <div className="featured-top-bar">
          <div>
            <div className="section-badge">Curated Selection</div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked pieces designed with superior craftsmanship and modern aesthetics.
            </p>
          </div>

          <div className="featured-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                className={`tab-btn ${activeFilter === tab.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        <div className="featured-footer-action">
          <Link to="/shop" className="btn btn-outline view-all-btn">
            View All Collection <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
