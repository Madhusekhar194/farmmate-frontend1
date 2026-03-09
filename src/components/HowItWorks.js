import React from 'react';

const HowItWorks = ({ t }) => {
  return (
    <section id="how-it-works" className="how-it-works">
      <h2 className="section-title">{t('how_it_works.title')}</h2>
      <div className="steps">
        <div className="step">
          <div className="step-icon"><i className="fas fa-seedling"></i></div>
          <h3>{t('how_it_works.step1_title')}</h3>
          <p>{t('how_it_works.step1_desc')}</p>
        </div>
        
        <div className="step">
          <div className="step-icon"><i className="fas fa-robot"></i></div>
          <h3>{t('how_it_works.step2_title')}</h3>
          <p>{t('how_it_works.step2_desc')}</p>
        </div>
        
        <div className="step">
          <div className="step-icon"><i className="fas fa-chart-line"></i></div>
          <h3>{t('how_it_works.step3_title')}</h3>
          <p>{t('how_it_works.step3_desc')}</p>
        </div>
      </div>

      <div style={{textAlign: 'center', marginTop: '3rem', padding: '0 2rem'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '1rem'}}>{t('how_it_works.why_title')}</h3>
        <p style={{fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto'}}>
          {t('how_it_works.why_desc')}
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;