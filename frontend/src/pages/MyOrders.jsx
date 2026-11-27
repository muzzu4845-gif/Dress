import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { useShop } from '../context/ShopContext';
import '../styles/Admin.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser, formatPrice } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="section-container" style={{ padding: '96px 24px', textAlign: 'center' }}>
        <h2>Loading your orders...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Fetching your STYLEHUB wardrobe history from our database.</p>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="section-container">
        <div className="orders-header-row">
          <div>
            <span className="section-badge">Wardrobe History</span>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Track your deliveries, view invoices, and manage past purchases.</p>
          </div>
          <Link to="/shop" className="btn btn-outline">
            Continue Shopping <FiArrowRight size={16} />
          </Link>
        </div>

        {error && <div className="auth-error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-icon-wrapper">
              <FiPackage size={56} />
            </div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders with STYLEHUB yet. Discover our curated collections today.</p>
            <Link to="/shop" className="btn btn-primary">
              Shop Now <FiArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="orders-history-list">
            {orders.map((order) => (
              <div key={order._id} className="order-history-card">
                <div className="order-card-top">
                  <div>
                    <span className="order-ref">{order.orderId}</span>
                    <span className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`badge-status ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`badge-status ${order.paymentStatus === 'Completed' ? 'delivered' : 'pending'}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-items-strip">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-mini-thumb">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>{item.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Size: {item.selectedSize} × {item.quantity} | {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-bottom">
                  <div>
                    <span>Delivery Address: </span>
                    <strong>{order.shippingAddress.address}, {order.shippingAddress.city}</strong>
                    <span style={{ color: 'var(--text-muted)' }}> ({order.paymentMethod})</span>
                  </div>

                  <div>
                    <span>Total Paid: </span>
                    <span className="order-grand-total">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
