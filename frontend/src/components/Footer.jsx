import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiMapPin, 
  FiMail, 
  FiPhone
} from 'react-icons/fi';
import { FaPinterestP, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-perks">
        <div className="footer-container perks-grid">
          <div className="perk-box">
            <span className="perk-num">01</span>
            <div>
              <h4>Ethical Sourcing</h4>
              <p>100% sustainably farmed combed organic cotton and recycled packaging.</p>
            </div>
          </div>
          <div className="perk-box">
            <span className="perk-num">02</span>
            <div>
              <h4>Pan-India Express</h4>
              <p>Fast track doorstep shipping with live tracking across 28,000+ pin codes.</p>
            </div>
          </div>
          <div className="perk-box">
            <span className="perk-num">03</span>
            <div>
              <h4>Easy 30-Day Returns</h4>
              <p>Zero questions asked reverse pickups and instant store refunds.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container footer-grid">
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              STYLE<span>HUB</span>
            </Link>
            <p className="brand-bio">
              STYLEHUB is a contemporary Indian fashion atelier creating timeless, minimal, 
              and premium clothing essentials for modern individuals.
            </p>
            
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                <FiInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                <FiFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                <FiTwitter size={18} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="social-link">
                <FaPinterestP size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">All Collections</Link></li>
              <li><Link to="/shop?category=men">Men's Wardrobe</Link></li>
              <li><Link to="/shop?category=women">Women's Wardrobe</Link></li>
              <li><Link to="/shop?category=t-shirts">Oversized T-Shirts</Link></li>
              <li><Link to="/shop?category=hoodies">Heavyweight Hoodies</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Customer Support</h4>
            <ul className="footer-nav-list">
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/cart">My Shopping Bag</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li><Link to="/orders">Order History & Tracking</Link></li>
              <li><Link to="/contact#faqs">Shipping & Delivery FAQs</Link></li>
              <li><Link to="/contact#returns">30-Day Return Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Concierge & Flagship</h4>
            <div className="contact-item">
              <FiMapPin className="contact-icon" size={18} />
              <span>STYLEHUB Atelier, 42 Indiranagar 100ft Road, Bengaluru, KA 560038</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" size={18} />
              <span>concierge@stylehub.com</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" size={18} />
              <span>+91 (080) 4120-8899</span>
            </div>
            <div className="operating-hours">
              <span>Mon – Sun: 10:00 AM – 8:00 PM IST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p className="copyright-text">
            © {new Date().getFullYear()} STYLEHUB Fashion Private Limited. All rights reserved.
          </p>
          
          <div className="payment-badges">
            <span className="pay-tag">UPI</span>
            <span className="pay-tag">VISA</span>
            <span className="pay-tag">Mastercard</span>
            <span className="pay-tag">RuPay</span>
            <span className="pay-tag">NetBanking</span>
            <span className="pay-tag">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
