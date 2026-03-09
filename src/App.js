import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CropForm from './components/CropForm';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import { translations } from './utils/translations';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [lang, setLang] = useState('en');

  const handleTestButtonClick = () => {
    setShowForm(true);
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <div className="App">
      <Header lang={lang} setLang={setLang} t={t} />
      <Hero onTestButtonClick={handleTestButtonClick} t={t} />
      <HowItWorks t={t} />
      {showForm && <CropForm t={t} />}
      <About t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </div>
  );
}

export default App;