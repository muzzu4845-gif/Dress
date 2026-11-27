import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiSliders, FiX, FiCheck } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import '../styles/Products.css';

const Shop = () => {
  const { products, formatPrice } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(7000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const categoriesList = [
    { label: 'All Collection', value: 'all' },
    { label: "Men's Fashion", value: 'men' },
    { label: "Women's Fashion", value: 'women' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Hoodies', value: 'hoodies' }
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchCategory =
          selectedCategory === 'all' ||
          (selectedCategory === 'men' && (item.gender === 'men' || item.category === 'men')) ||
          (selectedCategory === 'women' && (item.gender === 'women' || item.category === 'women')) ||
          item.category === selectedCategory;

        const matchSearch =
          searchQuery.trim() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchPrice = item.price <= priceRange;

        return matchCategory && matchSearch && matchPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    setSearchParams(value === 'all' ? {} : { category: value });
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(7000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="shop-page">
      <div className="shop-banner">
        <div className="section-container">
          <span className="shop-banner-tag">Complete Wardrobe</span>
          <h1 className="shop-banner-title">
            {selectedCategory === 'all' ? 'All Collections' : 
             selectedCategory === 'men' ? "Men's Fashion" :
             selectedCategory === 'women' ? "Women's Fashion" :
             selectedCategory === 't-shirts' ? "Oversized T-Shirts" : "Fleece Hoodies"}
          </h1>
          <p className="shop-banner-subtitle">
            Engineered silhouettes and mindful fabrics designed for modern longevity.
          </p>
        </div>
      </div>

      <div className="section-container shop-layout">
        <div className="mobile-filter-bar">
          <button 
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <FiSliders size={18} />
            <span>Filters & Categories</span>
          </button>

          <span className="results-badge">{filteredProducts.length} Products Found</span>
        </div>

        <aside className={`shop-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button 
              className="sidebar-close-btn"
              onClick={() => setMobileFilterOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Search Products</h4>
            <div className="filter-search-box">
              <FiSearch className="search-icon-small" size={16} />
              <input 
                type="text" 
                placeholder="Search style name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Department</h4>
            <div className="category-filter-list">
              {categoriesList.map((cat) => (
                <button
                  key={cat.value}
                  className={`category-filter-item ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.value)}
                >
                  <span className="filter-radio">
                    {selectedCategory === cat.value && <FiCheck size={12} />}
                  </span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="price-filter-header">
              <h4 className="filter-title">Max Price</h4>
              <span className="price-tag-value">{formatPrice(priceRange)}</span>
            </div>
            <input 
              type="range"
              min="1000"
              max="7000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>{formatPrice(1000)}</span>
              <span>{formatPrice(7000)}</span>
            </div>
          </div>

          <button 
            className="btn btn-outline reset-filters-btn"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </aside>

        <main className="shop-main-content">
          <div className="shop-controls-bar">
            <div className="showing-count">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </div>

            <div className="sort-dropdown-wrap">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {(selectedCategory !== 'all' || searchQuery || priceRange < 7000) && (
            <div className="active-filters-row">
              <span className="active-label">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="filter-pill">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategorySelect('all')}><FiX size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-pill">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><FiX size={12} /></button>
                </span>
              )}
              {priceRange < 7000 && (
                <span className="filter-pill">
                  Max: {formatPrice(priceRange)}
                  <button onClick={() => setPriceRange(7000)}><FiX size={12} /></button>
                </span>
              )}
              <button className="clear-all-inline" onClick={handleClearFilters}>
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="no-products-state">
              <div className="no-products-icon">
                <FiFilter size={40} />
              </div>
              <h3>No products match your criteria</h3>
              <p>Try resetting the price range or clearing your search term to see more items.</p>
              <button 
                className="btn btn-primary"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
