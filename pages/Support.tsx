import React, { useEffect, useState } from 'react';

const Support: React.FC = () => {
  useEffect(() => {
    document.title = 'Support - Quantummint Bookstore';
  }, []);

  const [ticketData, setTicketData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support ticket submitted:', ticketData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketData({
        category: '',
        priority: 'medium',
        subject: '',
        description: '',
        email: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <h1>Support Center</h1>
        <p className="subtitle">Get help with your account, purchases, or technical issues</p>

        <div className="support-grid">
          <div className="quick-links">
            <h2>Quick Help</h2>

            <div className="help-card">
              <div className="card-icon">📖</div>
              <h3>Knowledge Base</h3>
              <p>Browse articles and guides</p>
              <button className="link-btn">View Articles</button>
            </div>

            <div className="help-card">
              <div className="card-icon">❓</div>
              <h3>FAQ</h3>
              <p>Common questions answered</p>
              <button className="link-btn">Visit FAQ</button>
            </div>

            <div className="help-card">
              <div className="card-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Chat with support (9AM-5PM)</p>
              <button className="link-btn">Start Chat</button>
            </div>

            <div className="help-card">
              <div className="card-icon">📧</div>
              <h3>Email Support</h3>
              <p>help@quantummint.net</p>
              <button className="link-btn">Send Email</button>
            </div>

            <div className="status-section">
              <h3>System Status</h3>
              <div className="status-item">
                <span className="status-dot green"></span>
                <span>All Systems Operational</span>
              </div>
              <p className="status-updated">Last updated: 5 minutes ago</p>
            </div>
          </div>

          <div className="ticket-form-section">
            <h2>Submit a Support Ticket</h2>
            <p className="form-description">Can't find what you're looking for? Submit a ticket and we'll get back to you within 24 hours.</p>

            {submitted && (
              <div className="success-message">
                ✓ Ticket submitted! Reference #: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            )}

            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={ticketData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={ticketData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="account">Account Issues</option>
                    <option value="payment">Payment & Billing</option>
                    <option value="technical">Technical Problem</option>
                    <option value="content">Content Access</option>
                    <option value="seller">Seller Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={ticketData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={ticketData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={ticketData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Submit Ticket
              </button>
            </form>
          </div>
        </div>

        <div className="support-tips">
          <h2>Tips for Faster Support</h2>
          <div className="tips-grid">
            <div className="tip">
              <strong>Be Specific:</strong> Include error messages, screenshots, and step-by-step details
            </div>
            <div className="tip">
              <strong>Check FAQ First:</strong> Many common issues are already answered
            </div>
            <div className="tip">
              <strong>Include Details:</strong> Your account email, transaction IDs, book titles, etc.
            </div>
            <div className="tip">
              <strong>One Issue Per Ticket:</strong> Submit separate tickets for different problems
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .support-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .support-container h1 {
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }

        .support-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (max-width: 968px) {
          .support-grid {
            grid-template-columns: 1fr;
          }
        }

        .quick-links h2,
        .ticket-form-section h2 {
          color: var(--text);
          margin-bottom: 1.5rem;
        }

        .help-card {
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-bottom: 1rem;
          text-align: center;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .help-card h3 {
          color: var(--text);
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .help-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .link-btn {
          padding: 0.5rem 1.5rem;
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .link-btn:hover {
          background: var(--primary);
          color: white;
        }

        .status-section {
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-top: 1.5rem;
        }

        .status-section h3 {
          color: var(--text);
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-dot.green {
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .status-updated {
          font-size: 0.8rem;
          color: #888;
          margin-top: 0.5rem;
        }

        .form-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .support-form {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
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

        .support-tips {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
          padding: 2rem;
          border-radius: 12px;
        }

        .support-tips h2 {
          color: var(--text);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .tip {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .tip strong {
          color: var(--primary);
          display: block;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Support;
