import React, { useEffect, useState } from 'react';

const Contact: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us - Quantummint Bookstore';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">We'd love to hear from you. Get in touch with our team.</p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>

            <div className="info-item">
              <div className="icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>help@quantummint.net</p>
                <p className="secondary">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">📱</div>
              <div>
                <h3>Phone / WhatsApp</h3>
                <p>+232 XX XXX XXXX</p>
                <p className="secondary">Mon-Fri, 9AM-5PM GMT</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Freetown, Sierra Leone</p>
                <p className="secondary">West Africa</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">💬</div>
              <div>
                <h3>Social Media</h3>
                <p>Follow us for updates</p>
                <div className="social-links">
                  <a href="#" className="social-link">Twitter</a>
                  <a href="#" className="social-link">Facebook</a>
                  <a href="#" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitted && (
              <div className="success-message">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="seller">Seller Application</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-container h1 {
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-info h2,
        .contact-form-section h2 {
          color: var(--text);
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: 8px;
        }

        .icon {
          font-size: 2rem;
          min-width: 50px;
        }

        .info-item h3 {
          color: var(--text);
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
        }

        .info-item p {
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .info-item .secondary {
          font-size: 0.85rem;
          color: #888;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .social-link {
          color: var(--primary);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .social-link:hover {
          text-decoration: underline;
        }

        .contact-form {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text);
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .success-message {
          background: #10b981;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Contact;
