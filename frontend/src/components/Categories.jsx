import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { categories } from '../data/products';
import '../styles/Categories.css';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/shop?category=${slug}`);
  };

  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">Curated Departments</div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Explore our thoughtfully curated collections designed with timeless precision and pure versatility.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="category-image-wrap">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-img"
                  loading="lazy"
                />
                <div className="category-gradient"></div>
              </div>

              <div className="category-info">
                <span className="category-items-count">{category.itemCount}</span>
                <div className="category-name-row">
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-arrow-btn">
                    <FiArrowUpRight size={18} />
                  </div>
                </div>
                <p className="category-desc">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
