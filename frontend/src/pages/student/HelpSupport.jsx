import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpSupport.css';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I pay my hostel fees?',
      answer: 'You can pay your hostel fees through the Payments section in your dashboard. We accept online payments via UPI, net banking, and debit/credit cards. You can also pay at the hostel office during working hours.',
      category: 'Payment'
    },
    {
      id: 2,
      question: 'What are the mess timings?',
      answer: 'Mess timings are: Breakfast (7:30 AM - 9:30 AM), Lunch (12:00 PM - 2:00 PM), and Dinner (7:00 PM - 9:00 PM). Please note that timings may vary during weekends and holidays.',
      category: 'Mess'
    },
    {
      id: 3,
      question: 'How do I request a room change?',
      answer: 'Room change requests can be submitted through the Room Allotment section. Fill out the room change form with valid reasons. Approval depends on availability and valid justification.',
      category: 'Room'
    },
    {
      id: 4,
      question: 'What should I do if I have a maintenance issue?',
      answer: 'Report maintenance issues through the Complaints section in your dashboard. Provide detailed description and photos if possible. Emergency issues can be reported directly to the warden.',
      category: 'Maintenance'
    },
    {
      id: 5,
      question: 'How do I register visitors?',
      answer: 'Use the Visitor Log section to register visitors. Submit requests at least 24 hours in advance. Visitors must carry valid ID and register at the security desk upon arrival.',
      category: 'Visitors'
    },
    {
      id: 6,
      question: 'What are the hostel rules and regulations?',
      answer: 'Key rules include: No outside food in rooms, maintain cleanliness, no loud music after 10 PM, visitors only during designated hours, no smoking/drinking, and respect common areas.',
      category: 'Rules'
    }
  ];

  const contacts = [
    {
      title: 'Warden Office',
      phone: '+91 98765 43210',
      email: 'warden@hmcportal.edu',
      hours: '9:00 AM - 6:00 PM (Mon-Fri)',
      emergency: true
    },
    {
      title: 'Mess Manager',
      phone: '+91 98765 43211',
      email: 'mess@hmcportal.edu',
      hours: '7:00 AM - 9:00 PM (Daily)'
    },
    {
      title: 'Maintenance',
      phone: '+91 98765 43212',
      email: 'maintenance@hmcportal.edu',
      hours: '8:00 AM - 5:00 PM (Mon-Sat)'
    },
    {
      title: 'IT Support',
      phone: '+91 98765 43213',
      email: 'itsupport@hmcportal.edu',
      hours: '9:00 AM - 6:00 PM (Mon-Fri)'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Your message has been sent successfully! We will get back to you soon.');
    setContactForm({
      subject: '',
      category: '',
      message: '',
      priority: 'medium'
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="help-support-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/student/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Help & Support</h1>
      </div>

      <div className="help-container">
        <div className="tab-navigation">
          <button 
            className={activeTab === 'faq' ? 'active' : ''}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
          <button 
            className={activeTab === 'contact' ? 'active' : ''}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </button>
          <button 
            className={activeTab === 'support' ? 'active' : ''}
            onClick={() => setActiveTab('support')}
          >
            Submit Ticket
          </button>
        </div>

        {activeTab === 'faq' && (
          <div className="faq-section">
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions about hostel services</p>
            </div>

            <div className="faq-controls">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="category-filter">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  <option value="payment">Payment</option>
                  <option value="mess">Mess</option>
                  <option value="room">Room</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="visitors">Visitors</option>
                  <option value="rules">Rules</option>
                </select>
              </div>
            </div>

            <div className="faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <span className="category-tag">{faq.category}</span>
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No FAQs found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <div className="contact-header">
              <h2>Contact Information</h2>
              <p>Reach out to the appropriate department for assistance</p>
            </div>

            <div className="contacts-grid">
              {contacts.map((contact, index) => (
                <div key={index} className={`contact-card ${contact.emergency ? 'emergency' : ''}`}>
                  <div className="contact-title">
                    <h3>{contact.title}</h3>
                    {contact.emergency && <span className="emergency-badge">Emergency</span>}
                  </div>
                  
                  <div className="contact-details">
                    <div className="contact-item">
                      <span className="icon">📞</span>
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </div>
                    <div className="contact-item">
                      <span className="icon">📧</span>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </div>
                    <div className="contact-item">
                      <span className="icon">🕒</span>
                      <span>{contact.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="emergency-info">
              <h3>Emergency Contacts</h3>
              <div className="emergency-contacts">
                <div className="emergency-item">
                  <strong>Security:</strong> +91 98765 43200 (24/7)
                </div>
                <div className="emergency-item">
                  <strong>Medical Emergency:</strong> +91 98765 43201 (24/7)
                </div>
                <div className="emergency-item">
                  <strong>Fire Safety:</strong> +91 98765 43202 (24/7)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="support-section">
            <div className="support-header">
              <h2>Submit Support Ticket</h2>
              <p>Can't find what you're looking for? Send us a message and we'll help you out</p>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={contactForm.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="payment">Payment Issues</option>
                    <option value="mess">Mess Related</option>
                    <option value="room">Room Issues</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority">Priority *</label>
                  <select
                    id="priority"
                    name="priority"
                    value={contactForm.priority}
                    onChange={handleInputChange}
                    required
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
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Provide detailed information about your issue"
                  rows="6"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Submit Ticket
                </button>
              </div>
            </form>

            <div className="response-info">
              <h3>Response Times</h3>
              <div className="response-times">
                <div className="response-item">
                  <span className="priority-low">Low Priority:</span>
                  <span>2-3 business days</span>
                </div>
                <div className="response-item">
                  <span className="priority-medium">Medium Priority:</span>
                  <span>1-2 business days</span>
                </div>
                <div className="response-item">
                  <span className="priority-high">High Priority:</span>
                  <span>4-8 hours</span>
                </div>
                <div className="response-item">
                  <span className="priority-urgent">Urgent:</span>
                  <span>1-2 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
