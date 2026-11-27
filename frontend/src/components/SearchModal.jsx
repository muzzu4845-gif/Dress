import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import '../styles/Modals.css';

const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, products, formatPrice } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim() === '' 
    ? [] 
    : products.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSelectProduct = (id) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    navigate(`/product/${id}`);
  };

  const handlePopularSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <FiSearch className="search-modal-icon" size={24} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search for hoodies, t-shirts, blazers, linen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
          <button 
            className="search-close-btn"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="search-quick-tags">
          <span className="tags-label">Trending Now:</span>
          {['French Terry Hoodie', 'Boxy Tee', 'Linen Blazer', 'Trench Coat', 'Cashmere'].map(tag => (
            <button 
              key={tag}
              className="quick-tag-btn"
              onClick={() => handlePopularSearch(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="search-results-area">
          {searchTerm.trim() === '' ? (
            <div className="search-placeholder-view">
              <p>Type above to instantly explore products in our catalog.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="search-empty-view">
              <h4>No matches found for "{searchTerm}"</h4>
              <p>Try checking for spelling or searching for broader categories like "hoodie" or "t-shirt".</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id || product.id} 
                  className="search-result-card"
                  onClick={() => handleSelectProduct(product._id || product.id)}
                >
                  <img src={product.image} alt={product.name} className="result-thumb" />
                  <div className="result-details">
                    <span className="result-category">{product.category.toUpperCase()}</span>
                    <h5 className="result-title">{product.name}</h5>
                    <div className="result-pricing">
                      <span className="result-price">{formatPrice(product.price)}</span>
                      <span className="result-orig">{formatPrice(product.originalPrice)}</span>
                    </div>
                  </div>
                  <FiArrowRight className="result-arrow" size={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
