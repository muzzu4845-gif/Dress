import React, { useState } from 'react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import '../styles/Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-card">
          <div className="newsletter-badge">Exclusive Privileges</div>
          
          <h2 className="newsletter-heading">Stay in Style</h2>
          
          <p className="newsletter-subtitle">
            Subscribe to our VIP newsletter for private sales, lookbooks, 
            exclusive designer drops, and receive an instant <strong>10% off code</strong>.
          </p>

          {isSubmitted ? (
            <div className="newsletter-success">
              <FiCheckCircle className="success-icon" size={32} />
              <div className="success-content">
                <h4>Welcome to the STYLEHUB Inner Circle!</h4>
                <p>Check your inbox soon for your exclusive welcome gift code: <strong>STYLE10</strong></p>
              </div>
              <button 
                type="button" 
                className="reset-btn"
                onClick={() => setIsSubmitted(false)}
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form" noValidate>
              <div className="input-group">
                <FiMail className="input-icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address..."
                  className={`newsletter-input ${error ? 'input-error' : ''}`}
                />
                <button type="submit" className="subscribe-btn">
                  Subscribe
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <p className="privacy-note">
                🔒 We respect your privacy. No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
