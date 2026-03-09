import React from 'react';

const About = ({ t }) => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>{t('about.mission.title')}</h3>
            <p>{t('about.mission.text')}</p>
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.text')}</p>
          </div>
          <div className="about-features">
            <div className="feature-card">
              <h4>{t('about.why_us.ai_title')}</h4>
              <p>{t('about.why_us.ai_desc')}</p>
            </div>
            <div className="feature-card">
              <h4>{t('about.why_us.eco_title')}</h4>
              <p>{t('about.why_us.eco_desc')}</p>
            </div>
            <div className="feature-card">
              <h4>{t('about.why_us.local_title')}</h4>
              <p>{t('about.why_us.local_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
