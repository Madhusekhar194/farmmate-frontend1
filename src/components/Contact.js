import React, { useState } from 'react';

const Contact = ({ t }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">{t('contact.title')}</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>{t('contact.touch')}</h3>
            <p>{t('contact.feedback')}</p>
            <div className="info-item">
              <i className="fas fa-map-marker-alt text-success mr-3"></i>
              <p>Kurnool, Andhra Pradesh State</p>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope text-success mr-3"></i>
              <p>madhusekhar852@gmail.com</p>
            </div>
            <div className="info-item">
              <i className="fas fa-phone text-success mr-3"></i>
              <p>+91 98765 43210</p>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <h3>{t('contact.form.success')}</h3>
                <p>{t('contact.form.success_text')}</p>
                <button onClick={() => setSubmitted(false)} className="cta-button">{t('contact.form.another')}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>{t('contact.form.name')}</label>
                  <input type="text" placeholder={t('contact.form.placeholder_name')} required />
                </div>
                <div className="form-group">
                  <label>{t('contact.form.email')}</label>
                  <input type="email" placeholder={t('contact.form.placeholder_email')} required />
                </div>
                <div className="form-group">
                  <label>{t('contact.form.message')}</label>
                  <textarea rows="5" placeholder={t('contact.form.placeholder_message')} required></textarea>
                </div>
                <button type="submit" className="submit-btn">{t('contact.form.submit')}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
