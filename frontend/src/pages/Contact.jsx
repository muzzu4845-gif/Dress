import React, { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiClock, 
  FiSend, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp
} from 'react-icons/fi';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What are your standard shipping timelines across India?",
      a: "Orders are processed within 24 hours at our fulfillment atelier. Metro cities typically receive deliveries within 48 to 72 hours, while other regional destinations take between 3 to 5 business days."
    },
    {
      q: "How does your 30-Day Hassle-Free Return Policy work?",
      a: "We offer zero-questions-asked doorstep return pickup for all unused items with original tags intact. Simply initiate a return from your account or reach out to our concierge team, and our courier partner will pick up the parcel within 24 hours."
    },
    {
      q: "Are STYLEHUB fabrics 100% organic?",
      a: "Yes. Our signature tees and fleece hoodies are spun using GOTS-certified 100% combed organic ring-spun cotton and recycled blends, guaranteeing maximum breathability, skin-friendly softness, and longevity."
    },
    {
      q: "Which payment options are accepted?",
      a: "We accept all major Indian and international payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, and Cash on Delivery (COD)."
    }
  ];

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) errors.subject = 'Please choose or enter a subject.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please enter a message with at least 10 characters.';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero-banner">
        <div className="section-container">
          <span className="contact-badge">Client Concierge</span>
          <h1 className="contact-title">We'd Love to Hear From You</h1>
          <p className="contact-subtitle">
            Whether you have questions about sizing, bespoke orders, or order status, 
            our dedicated advisors are here to assist you.
          </p>
        </div>
      </div>

      <div className="section-container contact-content-grid">
        <div className="contact-form-column">
          <div className="form-card">
            <h3>Send Us a Message</h3>
            <p className="form-lead">Our team typically responds within 2 to 4 business hours.</p>

            {isSubmitted ? (
              <div className="contact-success-box">
                <FiCheckCircle size={48} className="success-icon" />
                <h4>Message Received!</h4>
                <p>
                  Thank you for reaching out. One of our dedicated fashion specialists has 
                  received your inquiry and will respond to your email shortly.
                </p>
                <button 
                  className="btn btn-outline send-another-btn"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="contact-form">
                <div className="form-row two-cols">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Arjun Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>

                  <div className="form-field">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="e.g. arjun@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-field">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Inquiry Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={formErrors.subject ? 'error' : ''}
                    >
                      <option value="">Select a topic...</option>
                      <option value="Order Tracking">Order Tracking & Dispatch</option>
                      <option value="Return or Exchange">Return or Exchange Request</option>
                      <option value="Sizing Advice">Sizing & Styling Advice</option>
                      <option value="Wholesale Inquiry">B2B / Wholesale Collaboration</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                    {formErrors.subject && <span className="field-error">{formErrors.subject}</span>}
                  </div>
                </div>

                <div className="form-field">
                  <label>Message *</label>
                  <textarea 
                    rows="5"
                    placeholder="Describe your inquiry in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={formErrors.message ? 'error' : ''}
                  ></textarea>
                  {formErrors.message && <span className="field-error">{formErrors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary submit-contact-btn">
                  <FiSend size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="contact-info-column">
          <div className="info-card">
            <h3>Direct Channels</h3>
            
            <div className="info-item">
              <div className="info-icon"><FiMail size={20} /></div>
              <div>
                <h5>Email Concierge</h5>
                <p>care@stylehub.com</p>
                <span>For corporate inquiries: partners@stylehub.com</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FiPhone size={20} /></div>
              <div>
                <h5>Phone Support</h5>
                <p>+91 (080) 4120-8899</p>
                <span>Toll Free: 1800-209-STYLE</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FiClock size={20} /></div>
              <div>
                <h5>Working Hours</h5>
                <p>Monday through Sunday</p>
                <span>10:00 AM – 8:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="info-card flagships">
            <h3>Flagship Boutiques</h3>
            <div className="boutique-entry">
              <h5>📍 Bengaluru Atelier</h5>
              <p>42, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038</p>
            </div>
            <div className="boutique-entry">
              <h5>📍 Mumbai Experience Studio</h5>
              <p>18 Linking Road, Bandra West, Mumbai, MH 400050</p>
            </div>
          </div>
        </div>
      </div>

      <section className="faq-section" id="faqs">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Got Questions?</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to our most commonly inquired shopping topics.</p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <div className="faq-question-row">
                  <h4>{faq.q}</h4>
                  <div className="faq-toggle-icon">
                    {openFaq === index ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
