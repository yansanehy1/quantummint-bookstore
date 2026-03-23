import React, { useEffect, useState } from 'react';

const FAQ: React.FC = () => {
    useEffect(() => {
        document.title = 'FAQ - Quantummint Bookstore';
    }, []);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    q: 'What is QuantumMint Bookstore?',
                    a: 'QuantumMint is a digital educational platform providing access to JSS and SSS curriculum books, audiobooks, and learning tools for students in Sierra Leone.',
                },
                {
                    q: 'Do I need to create an account?',
                    a: 'Yes, you need an account to purchase and access books. Registration is free and takes less than a minute.',
                },
                {
                    q: 'What devices can I use?',
                    a: 'QuantumMint works on smartphones, tablets, and computers. We recommend using modern browsers like Chrome, Firefox, or Safari.',
                },
            ],
        },
        {
            category: 'Payments & Pricing',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept wallet balance (USD/SLL), Stripe (credit/debit cards), Orange Money, QMoney, and AfriMoney.',
                },
                {
                    q: 'Can I pay in Sierra Leonean Leones?',
                    a: 'Yes! We support both USD and SLL. Prices are displayed in both currencies with current exchange rates.',
                },
                {
                    q: 'How does the wallet work?',
                    a: 'Your digital wallet stores funds in USD or SLL. You can deposit via mobile money or card, and use the balance for purchases.',
                },
                {
                    q: 'Are there any hidden fees?',
                    a: 'No hidden fees. The price you see is what you pay. Payment processor fees (if any) are clearly shown before checkout.',
                },
            ],
        },
        {
            category: 'Books & Content',
            questions: [
                {
                    q: 'What subjects are available?',
                    a: 'We offer books for all JSS and SSS subjects including Mathematics, English, Science, Social Studies, and more.',
                },
                {
                    q: 'Can I access books offline?',
                    a: 'Currently, an internet connection is required. Offline access is planned for future updates.',
                },
                {
                    q: 'How long do I have access to purchased books?',
                    a: 'Once purchased, you have lifetime access to the book in your library.',
                },
                {
                    q: 'Can I gift a book to someone?',
                    a: 'Yes! Use our gifting feature to send books via email or SMS to students.',
                },
            ],
        },
        {
            category: 'Audiobooks',
            questions: [
                {
                    q: 'What is the Audiobook Studio?',
                    a: 'Our AI-powered studio converts text into audiobooks with advanced formula detection for STEM subjects.',
                },
                {
                    q: 'Can I create my own audiobooks?',
                    a: 'Yes! Upload your text and our AI will generate an audiobook with proper pronunciation of equations and formulas.',
                },
                {
                    q: 'What languages are supported?',
                    a: 'Currently, we support English with accurate pronunciation of mathematical and scientific terms.',
                },
            ],
        },
        {
            category: 'For Sellers',
            questions: [
                {
                    q: 'How do I become a seller?',
                    a: 'Navigate to Seller Onboarding, complete the registration form, submit required documents, and await admin approval.',
                },
                {
                    q: 'What are the requirements for selling?',
                    a: 'You must provide original or properly licensed content, meet our quality standards, and agree to our seller terms.',
                },
                {
                    q: 'How much commission does QuantumMint take?',
                    a: 'Commission rates vary by content type. Details are provided in the Seller Agreement during onboarding.',
                },
                {
                    q: 'When do I get paid?',
                    a: 'Seller payouts are processed monthly. You can request withdrawals once you reach the minimum threshold.',
                },
            ],
        },
        {
            category: 'Technical Support',
            questions: [
                {
                    q: 'I forgot my password. What should I do?',
                    a: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your registered email.',
                },
                {
                    q: 'My payment failed. What should I do?',
                    a: 'Check your payment details and try again. If the issue persists, contact support with your transaction reference.',
                },
                {
                    q: 'How do I report a technical issue?',
                    a: 'Use the Support page or email support@quantummint.com with details about the problem.',
                },
            ],
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    let globalIndex = 0;

    return (
        <div className="faq-page">
            <div className="faq-container">
                <h1>Frequently Asked Questions</h1>
                <p className="subtitle">Find answers to common questions about QuantumMint Bookstore</p>

                {faqs.map((category, catIdx) => (
                    <div key={catIdx} className="faq-category">
                        <h2>{category.category}</h2>
                        <div className="faq-list">
                            {category.questions.map((item, qIdx) => {
                                const currentIndex = globalIndex++;
                                return (
                                    <div key={qIdx} className="faq-item">
                                        <button
                                            className={`faq-question ${openIndex === currentIndex ? 'active' : ''}`}
                                            onClick={() => toggleFAQ(currentIndex)}
                                        >
                                            <span>{item.q}</span>
                                            <span className="toggle-icon">{openIndex === currentIndex ? '−' : '+'}</span>
                                        </button>
                                        {openIndex === currentIndex && (
                                            <div className="faq-answer">{item.a}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="still-need-help">
                    <h2>Still need help?</h2>
                    <p>If you couldn't find the answer you're looking for, our support team is here to help.</p>
                    <button className="contact-btn" onClick={() => window.location.href = '#'}>
                        Contact Support
                    </button>
                </div>
            </div>

            <style>{`
        .faq-page {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-container h1 {
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }

        .faq-category {
          margin-bottom: 2.5rem;
        }

        .faq-category h2 {
          color: var(--text);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--primary);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .faq-item:hover {
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
        }

        .faq-question {
          width: 100%;
          background: var(--bg-secondary);
          border: none;
          padding: 1.25rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text);
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: var(--bg);
        }

        .faq-question.active {
          background: var(--bg);
          color: var(--primary);
        }

        .toggle-icon {
          font-size: 1.5rem;
          color: var(--primary);
          min-width: 24px;
          text-align: center;
        }

        .faq-answer {
          padding: 1.25rem;
          background: var(--bg);
          color: var(--text-secondary);
          line-height: 1.6;
          border-top: 1px solid var(--border);
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .still-need-help {
          margin-top: 4rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          border-radius: 12px;
          text-align: center;
        }

        .still-need-help h2 {
          color: var(--text);
          margin-bottom: 1rem;
        }

        .still-need-help p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .contact-btn {
          padding: 0.75rem 2rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .contact-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      `}</style>
        </div>
    );
};

export default FAQ;
