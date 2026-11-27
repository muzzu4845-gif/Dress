import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Member Access</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your STYLEHUB account to view orders, saved items, and bag.</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <FiArrowRight size={18} />
          </button>
        </form>

        <div className="demo-accounts-box">
          <div className="demo-title">Quick Demo Login</div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleFillDemo('admin@stylehub.com', 'AdminPassword123!')}
            >
              👑 Fill Admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleFillDemo('user@stylehub.com', 'UserPassword123!')}
            >
              🛍️ Fill Customer
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account yet?
          <Link to={`/register${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
