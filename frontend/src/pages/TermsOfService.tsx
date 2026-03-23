import React, { useEffect } from 'react';

const TermsOfService: React.FC = () => {
    useEffect(() => {
        document.title = 'Terms of Service - Quantummint Bookstore';
    }, []);

    return (
        <div className="terms-page">
            <div className="terms-container">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last Updated: November 28, 2024</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using QuantumMint Bookstore ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                </section>

                <section>
                    <h2>2. User Accounts</h2>
                    <h3>2.1 Account Creation</h3>
                    <p>You must create an account to access most features. You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of unauthorized access</li>
                        <li>Be responsible for all activities under your account</li>
                    </ul>

                    <h3>2.2 Account Types</h3>
                    <ul>
                        <li><strong>Learners:</strong> Purchase and access educational content</li>
                        <li><strong>Sellers:</strong> Submit books for review and sale (subject to approval)</li>
                        <li><strong>Admins:</strong> Platform management (by invitation only)</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Services Provided</h2>
                    <h3>3.1 Marketplace</h3>
                    <p>Access to educational books for JSS, SSS, and other academic levels in Sierra Leone.</p>

                    <h3>3.2 Audiobook Studio</h3>
                    <p>AI-powered audiobook creation with formula detection and text-to-speech conversion.</p>

                    <h3>3.3 Digital Wallet</h3>
                    <p>Multi-currency wallet (USD/SLL) for transactions within the platform.</p>

                    <h3>3.4 Gifting System</h3>
                    <p>Send educational materials as gifts via email or SMS.</p>
                </section>

                <section>
                    <h2>4. Payments and Pricing</h2>
                    <h3>4.1 Payment Methods</h3>
                    <p>We accept:</p>
                    <ul>
                        <li>Wallet balance (USD/SLL)</li>
                        <li>Stripe (credit/debit cards)</li>
                        <li>Orange Money</li>
                        <li>QMoney</li>
                        <li>AfriMoney</li>
                    </ul>

                    <h3>4.2 Pricing</h3>
                    <p>All prices are displayed in USD and SLL. Prices may vary and are subject to change without notice.</p>

                    <h3>4.3 Refunds</h3>
                    <p>Refunds are handled on a case-by-case basis. Digital content purchases are generally non-refundable unless there is a technical error preventing access.</p>
                </section>

                <section>
                    <h2>5. Seller Terms</h2>
                    <h3>5.1 Content Submission</h3>
                    <p>Sellers agree that:</p>
                    <ul>
                        <li>All submitted content is original or properly licensed</li>
                        <li>Content meets our quality and educational standards</li>
                        <li>Content does not infringe on intellectual property rights</li>
                        <li>Content will be subject to admin review before publication</li>
                    </ul>

                    <h3>5.2 Revenue Sharing</h3>
                    <p>Sellers receive a percentage of sales revenue as outlined in the Seller Agreement. Payouts are processed monthly.</p>
                </section>

                <section>
                    <h2>6. Intellectual Property</h2>
                    <p>All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of QuantumMint or its content suppliers and is protected by copyright laws.</p>
                </section>

                <section>
                    <h2>7. User Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Upload malicious code or viruses</li>
                        <li>Attempt to gain unauthorized access to systems</li>
                        <li>Engage in fraudulent activities</li>
                        <li>Harass or harm other users</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Content Moderation</h2>
                    <p>We use AI-powered moderation to ensure content quality and safety. We reserve the right to remove content that violates our policies.</p>
                </section>

                <section>
                    <h2>9. Termination</h2>
                    <p>We may suspend or terminate your account if you violate these Terms. You may terminate your account at any time through account settings.</p>
                </section>

                <section>
                    <h2>10. Limitation of Liability</h2>
                    <p>QuantumMint is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from use of the Platform.</p>
                </section>

                <section>
                    <h2>11. Governing Law</h2>
                    <p>These Terms are governed by the laws of Sierra Leone. Disputes will be resolved in courts of Freetown, Sierra Leone.</p>
                </section>

                <section>
                    <h2>12. Changes to Terms</h2>
                    <p>We may modify these Terms at any time. Continued use of the Platform constitutes acceptance of updated Terms.</p>
                </section>

                <section>
                    <h2>13. Contact</h2>
                    <p>
                        <strong>Email:</strong> legal@quantummint.com<br />
                        <strong>Website:</strong> www.quantummint.com
                    </p>
                </section>
            </div>

            <style>{`
        .terms-page {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .terms-container h1 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .last-updated {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .terms-container section {
          margin-bottom: 2rem;
        }

        .terms-container h2 {
          color: var(--text);
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }

        .terms-container h3 {
          color: var(--text);
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          margin-top: 1rem;
        }

        .terms-container ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .terms-container li {
          margin-bottom: 0.5rem;
        }

        .terms-container p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default TermsOfService;
