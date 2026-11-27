import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiShoppingBag, 
  FiHeart, 
  FiMenu, 
  FiX, 
  FiArrowRight,
  FiUser,
  FiLogOut,
  FiPackage,
  FiShield
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    currentUser, 
    isAdmin, 
    logout 
  } = useShop();

  const navigate = useNavigate();

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleCategoryNav = (slug) => {
    closeMenu();
    navigate(`/shop?category=${slug}`);
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="top-banner">
        <div className="top-banner-content">
          <span>✨ Complimentary Express Shipping on all orders above ₹1,999</span>
          <span className="banner-divider">|</span>
          <span className="banner-code">Use Code <strong>STYLE10</strong> for Extra 10% Off</span>
        </div>
      </div>

      <header className="navbar-header">
        <div className="navbar-container">
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <span className="brand-text">STYLE<span>HUB</span></span>
            <span className="brand-dot"></span>
          </Link>

          <nav className="desktop-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Shop
            </NavLink>
            <button 
              className="nav-link-btn" 
              onClick={() => handleCategoryNav('men')}
            >
              Men
            </button>
            <button 
              className="nav-link-btn" 
              onClick={() => handleCategoryNav('women')}
            >
              Women
            </button>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Contact
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} style={{ color: 'var(--accent-gold)' }}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="navbar-actions">
            <button 
              className="action-icon-btn" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search clothing"
              title="Search"
            >
              <FiSearch size={20} />
            </button>

            <Link 
              to="/wishlist" 
              className="action-icon-btn wishlist-icon-btn"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <FiHeart size={20} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            <button 
              className="action-icon-btn cart-icon-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Bag"
              title="Shopping Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
            </button>

            <div style={{ position: 'relative' }}>
              {currentUser ? (
                <button
                  className="action-icon-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User Account"
                  title={currentUser.name}
                  style={{
                    backgroundColor: 'var(--bg-beige)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="action-icon-btn"
                  aria-label="Sign In"
                  title="Sign In"
                >
                  <FiUser size={20} />
                </Link>
              )}

              {userDropdownOpen && currentUser && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '52px',
                    right: '0',
                    width: '220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    padding: '12px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>{currentUser.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</span>
                  </div>

                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      fontSize: '0.85rem',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <FiPackage size={16} /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        fontSize: '0.85rem',
                        borderRadius: '4px',
                        color: 'var(--accent-gold)',
                        fontWeight: '600'
                      }}
                    >
                      <FiShield size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      fontSize: '0.85rem',
                      borderRadius: '4px',
                      color: 'var(--accent-red)',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <FiLogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-inner">
            <div className="mobile-nav-links">
              <NavLink to="/" onClick={closeMenu} className="mobile-link">
                Home <FiArrowRight size={16} />
              </NavLink>
              <NavLink to="/shop" onClick={closeMenu} className="mobile-link">
                Shop All <FiArrowRight size={16} />
              </NavLink>
              <button onClick={() => handleCategoryNav('men')} className="mobile-link mobile-btn">
                Men's Collection <FiArrowRight size={16} />
              </button>
              <button onClick={() => handleCategoryNav('women')} className="mobile-link mobile-btn">
                Women's Collection <FiArrowRight size={16} />
              </button>
              <button onClick={() => handleCategoryNav('t-shirts')} className="mobile-link mobile-btn">
                T-Shirts <FiArrowRight size={16} />
              </button>
              <button onClick={() => handleCategoryNav('hoodies')} className="mobile-link mobile-btn">
                Hoodies <FiArrowRight size={16} />
              </button>
              <NavLink to="/wishlist" onClick={closeMenu} className="mobile-link">
                Wishlist ({wishlistCount}) <FiArrowRight size={16} />
              </NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/orders" onClick={closeMenu} className="mobile-link">
                    My Orders <FiArrowRight size={16} />
                  </NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" onClick={closeMenu} className="mobile-link" style={{ color: 'var(--accent-gold)' }}>
                      Admin Dashboard <FiArrowRight size={16} />
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="mobile-link mobile-btn" style={{ color: 'var(--accent-red)' }}>
                    Log Out <FiLogOut size={16} />
                  </button>
                </>
              ) : (
                <NavLink to="/login" onClick={closeMenu} className="mobile-link">
                  Sign In / Register <FiArrowRight size={16} />
                </NavLink>
              )}
              <NavLink to="/contact" onClick={closeMenu} className="mobile-link">
                Contact Us <FiArrowRight size={16} />
              </NavLink>
            </div>

            <div className="mobile-drawer-footer">
              <p>STYLEHUB Luxury Fashion</p>
              <span>{currentUser ? `Signed in as ${currentUser.name}` : 'Designed with modern simplicity'}</span>
            </div>
          </div>
        </div>
        {mobileMenuOpen && <div className="mobile-backdrop" onClick={closeMenu}></div>}
      </header>
    </>
  );
};

export default Navbar;
