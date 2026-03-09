import React from 'react';

const Hero = ({ onTestButtonClick, t }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <div className="hero-btns">
          <button onClick={onTestButtonClick} className="cta-button primary">
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;