import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import '../styles/Modals.css';

const CartDrawer = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    shippingFee, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    formatPrice 
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3>Shopping Bag</h3>
            <span className="drawer-item-count">{cartCount} items</span>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="shipping-progress-box">
          {cartSubtotal >= 1999 ? (
            <p className="shipping-congrats">🎉 You've unlocked <strong>FREE Express Shipping</strong>!</p>
          ) : (
            <div className="progress-content">
              <p>Add <strong>{formatPrice(1999 - cartSubtotal)}</strong> more for FREE Shipping!</p>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (cartSubtotal / 1999) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="drawer-items-list">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-icon">
                <FiShoppingBag size={48} />
              </div>
              <h4>Your bag is currently empty</h4>
              <p>Explore our latest arrivals and elevate your daily wardrobe.</p>
              <button 
                className="btn btn-primary shop-now-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId || item.id}-${item.selectedSize}`} className="drawer-cart-item">
                <img src={item.image} alt={item.name} className="drawer-item-img" />
                <div className="drawer-item-info">
                  <div className="drawer-item-header">
                    <h4 className="drawer-item-title">{item.name}</h4>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.productId || item.id, item.selectedSize)}
                      title="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <span className="drawer-item-size">Size: <strong>{item.selectedSize}</strong></span>

                  <div className="drawer-item-bottom">
                    <div className="quantity-controls mini">
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, item.selectedSize, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, item.selectedSize, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <span className="drawer-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal)}</strong>
            </div>
            <div className="drawer-summary-row">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? <strong className="free-text">FREE</strong> : formatPrice(shippingFee)}</span>
            </div>
            <div className="drawer-summary-row total-row">
              <span>Total Amount</span>
              <span className="drawer-total-price">{formatPrice(cartTotal)}</span>
            </div>

            <div className="drawer-cta-group">
              <Link 
                to="/cart" 
                className="btn btn-secondary view-cart-link"
                onClick={() => setIsCartOpen(false)}
              >
                View Full Bag
              </Link>
              <Link 
                to="/cart" 
                className="btn btn-primary checkout-link"
                onClick={() => setIsCartOpen(false)}
              >
                Checkout <FiArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
