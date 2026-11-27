import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiBox, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiAlertCircle, 
  FiX, 
  FiCheck 
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { apiRequest } from '../services/api';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { currentUser, isAdmin, formatPrice, showToast, refreshProducts } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 't-shirts',
    gender: 'men',
    price: '',
    originalPrice: '',
    stock: 50,
    image: '',
    description: ''
  });

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [statsData, prodsData, ordsData, usrsData] = await Promise.all([
        orderService.getAdminStats(),
        productService.getProducts({ limit: 100 }),
        orderService.getAllOrders({ limit: 50 }),
        apiRequest('/users')
      ]);

      setStats(statsData);
      setProductsList(prodsData.products || []);
      setOrdersList(ordsData.orders || []);
      setUsersList(usrsData || []);
    } catch (err) {
      showToast(err.message || 'Error loading admin data', 'info');
    }
  }, [isAdmin, showToast]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/admin');
    } else if (isAdmin) {
      fetchData();
    }
  }, [currentUser, isAdmin, navigate, fetchData]);

  if (!currentUser || !isAdmin) {
    return (
      <div className="section-container" style={{ padding: '96px 24px', textAlign: 'center' }}>
        <h2>Admin Access Required</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          This section is restricted to STYLEHUB staff and administrators.
        </p>
        <Link to="/login?redirect=/admin" className="btn btn-primary">
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 't-shirts',
      gender: 'men',
      price: '',
      originalPrice: '',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      description: 'Handcrafted luxury piece designed for effortless comfort and versatility.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      gender: prod.gender || 'unisex',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      image: prod.image,
      description: prod.description
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id || editingProduct.id, formData);
        showToast(`Product "${formData.name}" updated successfully!`);
      } else {
        await productService.createProduct(formData);
        showToast(`Product "${formData.name}" added to inventory!`);
      }
      setIsModalOpen(false);
      fetchData();
      refreshProducts();
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'info');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      try {
        await productService.deleteProduct(id);
        showToast(`Product "${name}" deleted.`);
        fetchData();
        refreshProducts();
      } catch (err) {
        showToast(err.message || 'Failed to delete product', 'info');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { orderStatus: newStatus });
      showToast(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'info');
    }
  };

  return (
    <div className="admin-page">
      <div className="section-container">
        <div className="admin-header-row">
          <div>
            <span className="section-badge">Atelier Management</span>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Live overview of catalog inventory, orders, customer accounts, and revenue.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <FiPlus size={18} /> Add New Garment
          </button>
        </div>

        <div className="admin-metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap"><FiDollarSign /></div>
            <div className="metric-info">
              <span>Total Revenue</span>
              <h3>{formatPrice(stats?.totalSales || 0)}</h3>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap"><FiShoppingBag /></div>
            <div className="metric-info">
              <span>Total Orders</span>
              <h3>{stats?.totalOrders || 0}</h3>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap"><FiBox /></div>
            <div className="metric-info">
              <span>Active Products</span>
              <h3>{stats?.totalProducts || 0}</h3>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap"><FiUsers /></div>
            <div className="metric-info">
              <span>Registered Users</span>
              <h3>{stats?.totalUsers || 0}</h3>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Alerts
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Manage Products ({productsList.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders ({ordersList.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Accounts ({usersList.length})
          </button>
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
              <div className="admin-card" style={{ borderLeft: '4px solid var(--accent-terracotta)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-terracotta)' }}>
                  <FiAlertCircle /> Inventory Low Stock Warning
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                  The following items have 10 or fewer units remaining in warehouse inventory:
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {stats.lowStockProducts.map((p) => (
                    <div key={p._id} style={{ background: 'var(--bg-beige-light)', padding: '8px 14px', borderRadius: '4px' }}>
                      <strong>{p.name}</strong>: <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>{p.stock} units left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Recent Customer Purchases</h3>
                <button className="btn btn-secondary" onClick={() => setActiveTab('orders')}>View All Orders</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders || []).map((ord) => (
                    <tr key={ord._id}>
                      <td><strong>{ord.orderId}</strong></td>
                      <td>{ord.user?.name || ord.shippingAddress?.fullName}</td>
                      <td>{ord.orderItems?.length || 0} items</td>
                      <td><strong>{formatPrice(ord.totalPrice)}</strong></td>
                      <td>
                        <span className={`badge-status ${ord.paymentStatus === 'Completed' ? 'delivered' : 'pending'}`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Catalog Inventory</h3>
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <FiPlus size={16} /> Add Product
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <img src={prod.image} alt={prod.name} className="table-product-thumb" />
                      <strong>{prod.name}</strong>
                    </td>
                    <td>{prod.category.toUpperCase()}</td>
                    <td>
                      <strong>{formatPrice(prod.price)}</strong>
                      {prod.originalPrice > prod.price && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                          {formatPrice(prod.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`stock-pill ${prod.stock <= 10 ? 'low' : 'good'}`}>
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td>★ {prod.rating}</td>
                    <td>
                      <div className="action-btns-group">
                        <button className="table-action-btn" onClick={() => handleOpenEditModal(prod)}>
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button className="table-action-btn delete" onClick={() => handleDeleteProduct(prod._id, prod.name)}>
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>All Customer Orders</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Method</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((ord) => (
                  <tr key={ord._id}>
                    <td><strong>{ord.orderId}</strong></td>
                    <td>
                      <strong>{ord.user?.name || ord.shippingAddress?.fullName}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </span>
                    </td>
                    <td>{ord.orderItems?.length} items</td>
                    <td><strong>{formatPrice(ord.totalPrice)}</strong></td>
                    <td>{ord.paymentMethod}</td>
                    <td>
                      <span className={`badge-status ${ord.paymentStatus === 'Completed' ? 'delivered' : 'pending'}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.82rem',
                          background: '#ffffff',
                          fontWeight: '600'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Registered Customer Accounts</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge-status ${u.role === 'admin' ? 'shipped' : 'pending'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3>{editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="auth-form">
                <div className="modal-form-grid">
                  <div className="auth-field full-span">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ padding: '12px', border: '1.5px solid var(--border-color)', borderRadius: '4px' }}
                    >
                      <option value="t-shirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="men">Men's Fashion</option>
                      <option value="women">Women's Fashion</option>
                    </select>
                  </div>

                  <div className="auth-field">
                    <label>Gender Fit *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ padding: '12px', border: '1.5px solid var(--border-color)', borderRadius: '4px' }}
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="auth-field">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Original Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Warehouse Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field full-span">
                    <label>Primary Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field full-span">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ padding: '12px', border: '1.5px solid var(--border-color)', borderRadius: '4px', fontFamily: 'inherit' }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiCheck size={16} /> Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
