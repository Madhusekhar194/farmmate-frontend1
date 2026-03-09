const Header = ({ lang, setLang, t }) => {
  return (
    <header className="header-master sticky-top">
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-xl navbar-dark bg-dark-elegant py-3 shadow-lg">
        <div className="container-fluid px-lg-5">
          <a className="navbar-brand d-flex align-items-center" href="#home">
            <span className="logo-icon mr-2">
              <i className="fas fa-seedling text-success"></i>
            </span>
            <span className="font-weight-bold" style={{ color: '#2ecc71', fontSize: '1.5rem', letterSpacing: '1px' }}>
              FarmMate
            </span>
          </a>
          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item active">
                <a className="nav-link nav-link-interactive px-3" href="#home">{t('nav.home')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-interactive px-3" href="#crop-form">{t('nav.analysis')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-interactive px-3" href="#features">{t('nav.features')}</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle nav-link-interactive px-3" href="#" id="resourcesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {t('nav.faq')}
                </a>
                <div className="dropdown-menu dropdown-menu-dark animate slideIn" aria-labelledby="resourcesDropdown">
                  <a className="dropdown-item" href="#faq">{t('nav.faq')}</a>
                  <a className="dropdown-item" href="#blog">{t('nav.blog')}</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#guide">Farmer Guide</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-interactive px-3" href="#about">{t('nav.about')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-interactive px-3" href="#contact">{t('nav.contact')}</a>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">

              <div className="lang-switcher-elegant mr-3">
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)} 
                  className="form-control form-control-sm bg-transparent text-white border-secondary lang-glass"
                >
                  <option value="en" className="text-dark">English</option>
                  <option value="te" className="text-dark">తెలుగు</option>
                  <option value="kn" className="text-dark">ಕನ್ನಡ</option>
                  <option value="ta" className="text-dark">தமிழ்</option>
                  <option value="pa" className="text-dark">ਪੰਜਾਬੀ</option>
                  <option value="bn" className="text-dark">বাংলা</option>
                  <option value="ur" className="text-dark">اردو</option>
                  <option value="gu" className="text-dark">ગુજરાતી</option>
                  <option value="ml" className="text-dark">മലയാളം</option>
                  <option value="hi" className="text-dark">हिन्दी</option>
                </select>
              </div>

              <a href="#support" className="btn btn-success btn-sm px-4 font-weight-bold shadow-sm pulse-button">
                {t('nav.support')}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;