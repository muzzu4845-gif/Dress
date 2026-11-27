import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiArrowRight, 
  FiArrowLeft, 
  FiShoppingBag, 
  FiCheckCircle, 
  FiTag, 
  FiShield,
  FiMapPin
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { orderService } from '../services/orderService';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartOriginalTotal, 
    cartSavings, 
    shippingFee, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    formatPrice, 
    showToast,
    currentUser
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.name || '',
    address: '42 Indiranagar 100ft Road',
    city: 'Bengaluru',
    postalCode: '560038',
    state: 'Karnataka',
    phone: '+91 98765 43210'
  });

  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'STYLE10') {
      setDiscountApplied(true);
      showToast('10% Coupon STYLE10 Applied Successfully! 🎉');
    } else {
      setPromoError('Invalid coupon code. Try using STYLE10');
    }
  };

  const promoDiscount = discountApplied ? Math.round(cartSubtotal * 0.10) : 0;
  const finalPayable = Math.max(0, cartTotal - promoDiscount);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!currentUser) {
      showToast('Please sign in to place your order.', 'info');
      navigate('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      showToast('Please provide your complete delivery address.', 'info');
      setShowAddressModal(true);
      return;
    }

    try {
      setIsCheckingOut(true);

      const orderData = {
        orderItems: cart.map((item) => ({
          productId: item.productId || item._id || item.id,
          name: item.name,
          image: item.image,
          selectedSize: item.selectedSize || 'M',
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        promoCode: discountApplied ? 'STYLE10' : ''
      };

      const response = await orderService.createOrder(orderData);
      const { order, razorpayOrderId, razorpayKeyId } = response;

      if (paymentMethod === 'Cash on Delivery') {
        setOrderComplete(order);
        clearCart();
        showToast('Order confirmed via Cash on Delivery!');
        setIsCheckingOut(false);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();

      if (isScriptLoaded && window.Razorpay && razorpayOrderId) {
        const options = {
          key: razorpayKeyId || 'rzp_test_STYLEHUB2026DEMO',
          amount: Math.round(order.totalPrice * 100),
          currency: 'INR',
          name: 'STYLEHUB Fashion',
          description: `Order ${order.orderId}`,
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200',
          order_id: razorpayOrderId,
          prefill: {
            name: currentUser.name,
            email: currentUser.email,
            contact: shippingAddress.phone || '+919876543210'
          },
          theme: {
            color: '#121212'
          },
          handler: async function (rzpResponse) {
            try {
              const verifyRes = await orderService.verifyPayment(order._id, {
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature
              });
              setOrderComplete(verifyRes.order);
              clearCart();
              showToast('Payment verified & order placed successfully! 🎉');
            } catch (vErr) {
              showToast(vErr.message || 'Payment verification failed', 'info');
            }
          },
          modal: {
            ondismiss: function () {
              setIsCheckingOut(false);
              showToast('Payment window closed. You can retry anytime.', 'info');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        const verifyRes = await orderService.verifyPayment(order._id, {
          razorpay_order_id: razorpayOrderId || `order_test_${Date.now()}`,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'mock_test_signature'
        });
        setOrderComplete(verifyRes.order);
        clearCart();
        showToast('Order placed successfully (Razorpay Test Mode Confirmed)! 🎉');
      }
    } catch (err) {
      showToast(err.message || 'Checkout failed. Please check product stock.', 'info');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="section-container order-success-page">
        <div className="order-success-card">
          <div className="success-icon-badge">
            <FiCheckCircle size={64} />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-lead">
            Thank you for shopping with <strong>STYLEHUB</strong>. Your stylish wardrobe additions are being prepared!
          </p>
          <div className="order-confirmation-details">
            <div className="order-number">
              <span>Order Reference:</span>
              <strong>{orderComplete.orderId}</strong>
            </div>
            <p>
              Payment Method: <strong>{orderComplete.paymentMethod}</strong> ({orderComplete.paymentStatus})
            </p>
            <p style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Delivering to: {orderComplete.shippingAddress?.address}, {orderComplete.shippingAddress?.city}
            </p>
          </div>
          <div className="order-success-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-secondary">
              View My Orders
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setOrderComplete(null);
                navigate('/shop');
              }}
            >
              Continue Shopping <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="section-container empty-cart-page">
        <div className="empty-cart-card">
          <div className="empty-icon-wrapper">
            <FiShoppingBag size={56} />
          </div>
          <h2>Your Shopping Bag is Empty</h2>
          <p>
            You haven't added any garments to your bag yet. Explore our curated collections 
            and elevate your signature aesthetic.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Explore Collection <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="section-container">
        <div className="cart-header-title">
          <h1>Your Shopping Bag</h1>
          <span>({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
        </div>

        <div className="cart-grid">
          <div className="cart-items-column">
            <div className="cart-table-header">
              <span className="col-product">Product</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Subtotal</span>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={`${item.productId || item.id}-${item.selectedSize}`} className="cart-row-item">
                  <div className="item-details-flex">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="item-meta">
                      <span className="item-cat">{item.category?.toUpperCase()}</span>
                      <h3 className="item-title">
                        <Link to={`/product/${item.productId || item.id}`}>{item.name}</Link>
                      </h3>
                      <div className="item-size-pill">
                        Size: <strong>{item.selectedSize}</strong>
                      </div>
                      <button 
                        className="item-remove-inline"
                        onClick={() => removeFromCart(item.productId || item.id, item.selectedSize)}
                      >
                        <FiTrash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-unit-price">
                    <span className="price-val">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="orig-price-val">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>

                  <div className="item-quantity-cell">
                    <div className="qty-picker">
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, item.selectedSize, item.quantity - 1)}
                        aria-label="Reduce quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, item.selectedSize, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="item-line-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--bg-beige-light)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMapPin /> Delivery Address
                </h4>
                <button
                  type="button"
                  style={{ fontSize: '0.82rem', color: 'var(--text-primary)', textDecoration: 'underline', fontWeight: '600' }}
                  onClick={() => setShowAddressModal(true)}
                >
                  Edit Address
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <strong>{shippingAddress.fullName || (currentUser?.name || 'Customer')}</strong> | {shippingAddress.phone}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
              </p>

              <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

              <h4 style={{ marginBottom: '12px' }}>Choose Payment Method</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '6px',
                    border: paymentMethod === 'Razorpay' ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem' }}>Razorpay (Test Mode)</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cards, UPI, NetBanking</span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '6px',
                    border: paymentMethod === 'Cash on Delivery' ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem' }}>Cash on Delivery</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Pay at doorstep</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="cart-table-footer">
              <Link to="/shop" className="continue-shopping-btn">
                <FiArrowLeft size={16} /> Continue Shopping
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Shopping Bag
              </button>
            </div>
          </div>

          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <form onSubmit={handleApplyPromo} className="promo-box">
                <label htmlFor="promo-input">Have a Promo Code?</label>
                <div className="promo-input-row">
                  <div className="promo-input-wrap">
                    <FiTag className="promo-tag-icon" size={16} />
                    <input 
                      id="promo-input"
                      type="text" 
                      placeholder="Try code: STYLE10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={discountApplied}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="apply-promo-btn"
                    disabled={discountApplied}
                  >
                    {discountApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="promo-error">{promoError}</p>}
                {discountApplied && (
                  <p className="promo-success">✨ 10% STYLEHUB VIP discount applied!</p>
                )}
              </form>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Bag Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="summary-row savings-row">
                  <span>Catalog Discount</span>
                  <span>- {formatPrice(cartSavings)}</span>
                </div>

                {discountApplied && (
                  <div className="summary-row promo-row">
                    <span>VIP Coupon (STYLE10)</span>
                    <span className="discount-value">- {formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="free-shipping-tag">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span className="total-price">{formatPrice(finalPayable)}</span>
                </div>
                <p className="tax-subtext">Includes GST & all applicable charges</p>
              </div>

              <button 
                className="btn btn-primary checkout-action-btn"
                onClick={handleCheckoutSubmit}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Securing Order...' : `Pay ${formatPrice(finalPayable)}`}
                {!isCheckingOut && <FiArrowRight size={18} />}
              </button>

              <div className="summary-trust">
                <FiShield size={20} className="trust-shield" />
                <span>256-bit Encrypted Razorpay Test Checkout & Verified Authenticity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Edit Delivery Address</h3>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddressModal(false); showToast('Address updated!'); }} className="auth-form">
              <div className="auth-field">
                <label>Recipient Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="auth-field">
                <label>Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-grid">
                <div className="auth-field">
                  <label>City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-grid">
                <div className="auth-field">
                  <label>State</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', width: '100%' }}>
                Save & Use Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
