import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
    useEffect(() => {
        document.title = 'Privacy Policy - Quantummint Bookstore';
    }, []);

    return (
        <div className="privacy-policy-page">
            <div className="policy-container">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: November 28, 2024</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>At QuantumMint Bookstore, we collect information that you provide directly to us, including:</p>
                    <ul>
                        <li>Account information (name, email address, phone number)</li>
                        <li>Payment information (processed securely through our payment partners)</li>
                        <li>Reading preferences and analytics</li>
                        <li>Referral program data</li>
                        <li>Communication preferences</li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul>
                        <li>Provide and maintain our services</li>
                        <li>Process your transactions and manage your wallet</li>
                        <li>Send you audiobooks and course materials</li>
                        <li>Improve our platform and personalize your experience</li>
                        <li>Communicate with you about updates, offers, and support</li>
                        <li>Detect and prevent fraud</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Data Security</h2>
                    <p>We implement industry-standard security measures to protect your personal information:</p>
                    <ul>
                        <li>End-to-end encryption for sensitive data</li>
                        <li>Secure payment processing via Stripe and mobile money providers</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and authentication</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Third-Party Services</h2>
                    <p>We work with trusted third-party services:</p>
                    <ul>
                        <li><strong>Payment Processors:</strong> Stripe, Orange Money, QMoney</li>
                        <li><strong>SMS Services:</strong> Africa's Talking</li>
                        <li><strong>AI Services:</strong> Google AI, OpenAI (for audiobook generation)</li>
                        <li><strong>Analytics:</strong> Google Analytics, Mixpanel</li>
                    </ul>
                    <p>These partners have their own privacy policies governing their use of your information.</p>
                </section>

                <section>
                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request corrections to your information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Export your data in a portable format</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Cookies and Tracking</h2>
                    <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.</p>
                </section>

                <section>
                    <h2>7. Children's Privacy</h2>
                    <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
                </section>

                <section>
                    <h2>8. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our platform.</p>
                </section>

                <section>
                    <h2>9. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us at:</p>
                    <p>
                        <strong>Email:</strong> privacy@quantummint.com<br />
                        <strong>Address:</strong> Freetown, Sierra Leone
                    </p>
                </section>
            </div>

            <style>{`
        .privacy-policy-page {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .policy-container h1 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .last-updated {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .policy-container section {
          margin-bottom: 2rem;
        }

        .policy-container h2 {
          color: var(--text);
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }

        .policy-container ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-container li {
          margin-bottom: 0.5rem;
        }

        .policy-container p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;
