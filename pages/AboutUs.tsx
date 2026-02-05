import React, { useEffect } from 'react';

const AboutUs: React.FC = () => {
    useEffect(() => {
        document.title = 'About Us - Quantummint Bookstore';
    }, []);

    return (
        <div className="about-page">
            <div className="about-container">
                <h1>About QuantumMint Bookstore</h1>

                <section className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        QuantumMint Bookstore is revolutionizing education in Sierra Leone by providing accessible,
                        affordable digital educational content across all levels of education - from JSS (Junior Secondary School)
                        and SSS (Senior Secondary School) to College, University, and Adult Education.
                    </p>
                    <p>
                        We believe every student deserves quality educational materials, regardless of their location or economic background.
                    </p>
                </section>

                <section>
                    <h2>What We Offer</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>📚 Digital Library</h3>
                            <p>Extensive library of curriculum-aligned books covering all academic subjects across JSS, SSS, College, University, and Adult Education levels.</p>
                        </div>

                        <div className="feature-card">
                            <h3>🎧 AI Audiobooks</h3>
                            <p>Transform any text into audiobooks with our AI-powered studio, featuring advanced formula detection for STEM subjects.</p>
                        </div>

                        <div className="feature-card">
                            <h3>💰 Flexible Payment</h3>
                            <p>Support for USD/SLL with mobile money integration (Orange Money, QMoney) and international cards via Stripe.</p>
                        </div>

                        <div className="feature-card">
                            <h3>🎁 Gift System</h3>
                            <p>Send educational materials as gifts to students via email or SMS.</p>
                        </div>

                        <div className="feature-card">
                            <h3>📊 Learning Analytics</h3>
                            <p>Track reading progress, comprehension, and learning patterns to optimize study strategies.</p>
                        </div>

                        <div className="feature-card">
                            <h3>👥 Referral Program</h3>
                            <p>Earn 2 hours of reading/listening time by referring friends and helping expand access to education.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Our Story</h2>
                    <p>
                        Founded in 2024, QuantumMint was born from a simple observation: students in Sierra Leone
                        face significant barriers accessing quality educational materials. Physical textbooks are expensive,
                        often unavailable, and difficult to transport.
                    </p>
                    <p>
                        Our platform combines cutting-edge technology with deep understanding of local educational needs.
                        We've partnered with educators, content creators, and payment providers to build a comprehensive
                        ecosystem that serves students, teachers, and parents.
                    </p>
                </section>

                <section>
                    <h2>Technology & Innovation</h2>
                    <ul>
                        <li><strong>AI-Powered:</strong> Advanced text analysis, formula detection, and text-to-speech for STEM subjects</li>
                        <li><strong>Mobile-First:</strong> Optimized for smartphones and low-bandwidth environments</li>
                        <li><strong>Multi-Currency:</strong> Seamless USD/SLL transactions with competitive exchange rates</li>
                        <li><strong>Secure:</strong> End-to-end encryption and industry-standard security practices</li>
                    </ul>
                </section>

                <section>
                    <h2>For Sellers & Educators</h2>
                    <p>
                        We welcome content creators to join our platform. Sell your educational materials,
                        reach thousands of students, and earn sustainable income while contributing to education in Sierra Leone.
                    </p>
                    <p>
                        All seller content undergoes quality review to ensure it meets educational standards.
                    </p>
                </section>

                <section>
                    <h2>Community Impact</h2>
                    <p>
                        Every book purchased helps fund scholarships for underprivileged students.
                        A percentage of our revenue goes toward:
                    </p>
                    <ul>
                        <li>Free access programs for low-income students</li>
                        <li>Digital literacy training in rural communities</li>
                        <li>Supporting local educators and content creators</li>
                    </ul>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        <strong>Email:</strong> info@quantummint.net<br />
                        <strong>Location:</strong> Freetown, Sierra Leone<br />
                        <strong>Support:</strong> help@quantummint.net
                    </p>
                </section>
            </div>

            <style>{`
        .about-page {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-container h1 {
          color: var(--primary);
          margin-bottom: 2rem;
          text-align: center;
        }

        .mission {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .about-container section {
          margin-bottom: 3rem;
        }

        .about-container h2 {
          color: var(--text);
          margin-bottom: 1rem;
          border-bottom: 2px solid var(--primary);
          padding-bottom: 0.5rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .feature-card {
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
        }

        .feature-card h3 {
          color: var(--primary);
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .about-container ul {
          margin-left: 1.5rem;
          margin-top: 1rem;
        }

        .about-container li {
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .about-container p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default AboutUs;
