  import React, { useState, useRef } from 'react';
import { getCropRecommendation } from '../services/api';
import { parseCSVData, extractTextFromPDF, extractTextFromDocx, extractTextFromImage, parseSoilParameters } from '../utils/fileUtils';

const cropImages = {
  'rice': 'https://images.unsplash.com/photo-1536657235019-0307126feb2b?auto=format&fit=crop&w=1200&q=80',
  'maize': 'https://images.unsplash.com/photo-1551733215-188e99b0834a?auto=format&fit=crop&w=1200&q=80',
  'chickpea': 'https://images.unsplash.com/photo-1515544837664-2c6c39447b4e?auto=format&fit=crop&w=1200&q=80',
  'kidneybeans': 'https://images.unsplash.com/photo-1550913291-7b56961427a1?auto=format&fit=crop&w=1200&q=80',
  'pigeonpeas': 'https://images.unsplash.com/photo-1627662236973-4fda8c53044a?auto=format&fit=crop&w=1200&q=80',
  'mothbeans': 'https://images.unsplash.com/photo-1599307734185-603183570024?auto=format&fit=crop&w=1200&q=80',
  'mungbean': 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&w=1200&q=80',
  'blackgram': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
  'lentil': 'https://images.unsplash.com/photo-1522031174626-47eb03289945?auto=format&fit=crop&w=1200&q=80',
  'pomegranate': 'https://images.unsplash.com/photo-1615485240384-552e400609b0?auto=format&fit=crop&w=1200&q=80',
  'banana': 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1200&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80',
  'grapes': 'https://images.unsplash.com/photo-1533604195157-8fbe3f03b29c?auto=format&fit=crop&w=1200&q=80',
  'watermelon': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1200&q=80',
  'muskmelon': 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=80',
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1200&q=80',
  'papaya': 'https://images.unsplash.com/photo-1526644914016-cf496d5e2363?auto=format&fit=crop&w=1200&q=80',
  'coconut': 'https://images.unsplash.com/photo-1550070206-b5ec98cbb310?auto=format&fit=crop&w=1200&q=80',
  'cotton': 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=1200&q=80',
  'jute': 'https://images.unsplash.com/photo-1629810848981-d13de55536be?auto=format&fit=crop&w=1200&q=80',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  'soybean': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80',
  'sugarcane': 'https://images.unsplash.com/photo-1593113618194-bfdec0774a3f?auto=format&fit=crop&w=1200&q=80',
  'corn': 'https://images.unsplash.com/photo-1530513904646-6da90bb35352?auto=format&fit=crop&w=1200&q=80',
  'paddy': 'https://images.unsplash.com/photo-1512148869186-0145a550972e?auto=format&fit=crop&w=1200&q=80',
  'default': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80'
};

const CropForm = ({ t }) => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing Soil...');
  const [showGiftBox, setShowGiftBox] = useState(false); 
  const [error, setError] = useState(null);
  const [extractedReportData, setExtractedReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'report'
  const fileInputRef = useRef(null);
  const reportInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setLoadingText('Reading CSV file...');
      const data = await parseCSVData(file);
      
      setFormData(prev => ({
        ...prev,
        ...data
      }));
      
      setLoading(false);
      // Reset file input
      e.target.value = '';
    } catch (err) {
      setLoading(false);
      setError('Error parsing CSV file. Please ensure it has the correct headers (N, P, K, etc.)');
      console.error(err);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const triggerReportUpload = () => {
    reportInputRef.current.click();
  };

  const handleReportAnalysis = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResults(null);
    setExtractedReportData(null);
    setShowGiftBox(false);
    setError(null);

    try {
      setLoadingText('Extracting text from report...');
      let text = '';
      const fileType = file.type;
      
      if (fileType === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDocx(file);
      } else if (fileType.includes('image/')) {
        setLoadingText('Scanning image with AI OCR...');
        text = await extractTextFromImage(file);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF, Word document, or an Image.');
      }

      setLoadingText('Parsing soil data...');
      console.log('Raw Extracted Text:', text);
      
      if (!text || text.trim().length < 10) {
        throw new Error('The scanned text seems too short or empty. Please ensure the photo is clear and contains readable text.');
      }

      const extractedData = parseSoilParameters(text);
      setExtractedReportData(extractedData);
      
      // Check for mandatory soil data (N, P, K, pH)
      const mandatoryFields = ['nitrogen', 'phosphorus', 'potassium', 'ph'];
      const missingMandatory = mandatoryFields.filter(f => !extractedData[f]);
      
      if (missingMandatory.length > 0) {
        const fieldNames = missingMandatory.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ');
        throw new Error(`The report is missing mandatory parameters: ${fieldNames}. These must be extracted for an accurate prediction. Please ensure the document is clear.`);
      }

      // Fill in defaults ONLY for environmental fields (Temp, Hum, Rain)
      const completeData = {
        ...extractedData,
        temperature: extractedData.temperature || '25',
        humidity: extractedData.humidity || '40',
        rainfall: extractedData.rainfall || '100',
      };

      // Mark which fields are using defaults (should only be temp, hum, rain)
      const flags = {};
      Object.keys(completeData).forEach(key => {
        flags[key] = !extractedData[key];
      });
      setExtractedReportData({ ...completeData, _isDefault: flags });

      setLoadingText('Running AI Prediction...');
      await runPrediction(completeData);
      
      e.target.value = '';
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error processing report.');
      console.error(err);
    }
  };

  const runPrediction = async (data) => {
    // Interactive loading sequence
    const sequence = [
      t('form.load_nutrient'), 
      t('form.load_climate'), 
      t('form.load_ai'), 
      t('form.load_gen')
    ];
    let seqIdx = 0;
    const interval = setInterval(() => {
      if (seqIdx < sequence.length) {
        setLoadingText(sequence[seqIdx]);
        seqIdx++;
      }
    }, 800);

    try {
      const response = await getCropRecommendation(data);
      
      let recommendedCrop = '';
      let confidence = 0.95;
      
      if (response) {
        const validCrops = Object.keys(cropImages).filter(k => k !== 'default');
        let rawResult = '';
        
        if (response.recommendedCrop) {
          rawResult = response.recommendedCrop;
        } else if (response.result) {
          rawResult = response.result;
        } else {
          rawResult = typeof response === 'string' ? response : JSON.stringify(response);
        }

        if (typeof rawResult === 'string') {
          const nameMatch = rawResult.match(/result=([^,}\s]+)/) || rawResult.match(/^{result=([^,}\s]+)/);
          if (nameMatch) {
            recommendedCrop = nameMatch[1].toLowerCase();
          } else {
            const found = validCrops.find(crop => rawResult.toLowerCase().includes(crop.toLowerCase()));
            if (found) recommendedCrop = found;
          }
          
          if (recommendedCrop) {
            const probMatch = rawResult.match(new RegExp(`${recommendedCrop}=([0-9.]+)`, 'i'));
            if (probMatch) confidence = parseFloat(probMatch[1]);
          }
        } else {
          recommendedCrop = String(rawResult).toLowerCase();
        }

        if (!recommendedCrop || !validCrops.includes(recommendedCrop)) {
          recommendedCrop = 'rice';
        }
      }

      const imageUrl = cropImages[recommendedCrop] || cropImages['default'];
      await new Promise(r => setTimeout(r, 1200));
      clearInterval(interval);

      const finalResult = {
        crop: t(`crops.${recommendedCrop}`) !== `crops.${recommendedCrop}` 
               ? t(`crops.${recommendedCrop}`) 
               : recommendedCrop.charAt(0).toUpperCase() + recommendedCrop.slice(1),
        confidence: confidence,
        image: imageUrl,
        debug: recommendedCrop,
        reasons: [
          t('results.reason1'),
          t('results.reason2'),
          t('results.reason3'),
          t('results.reason4')
        ]
      };

      setLoading(false);
      setShowGiftBox(true);
      
      setTimeout(() => {
        setResults(finalResult);
        setShowGiftBox(false);
      }, 1500);

    } catch (error) {
      clearInterval(interval);
      setLoading(false);
      setShowGiftBox(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null); 
    setShowGiftBox(false);
    setError(null);
    
    try {
      await runPrediction(formData);
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setError('Connection timeout. Please ensure the backend is running on port 9090.');
    }
  };

  return (
    <section id="crop-form" className="crop-form-section">
      <div className="form-container">
        <h2 className="section-header">
          {t('form.title')}
          <span className="header-subtitle">{t('form.subtitle')}</span>
        </h2>
        
        {error && (
          <div className="error-message">
            <strong>System Error:</strong> {error}
          </div>
        )}

        <div className="form-tabs">
          <button 
            className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => { setActiveTab('manual'); setResults(null); }}
          >
            {t('form.tab_manual') || 'Manual Entry'}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => { setActiveTab('report'); setResults(null); }}
          >
            {t('form.tab_report') || 'Report Analysis'}
          </button>
        </div>

        {activeTab === 'manual' ? (
          <>
            <div className="form-actions-top">
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <button 
                type="button" 
                className="btn-upload" 
                onClick={triggerFileUpload}
                disabled={loading}
              >
                <i className="fas fa-file-upload"></i> {t('form.upload_csv') || 'Upload Soil CSV'}
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modern-crop-form">
              <div className="form-grid-stable">
                <div className="form-input-group">
                  <label>{t('form.nitrogen')}</label>
                  <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="e.g., 50 mg/kg" required />
                </div>

                <div className="form-input-group">
                  <label>{t('form.phosphorus')}</label>
                  <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="e.g., 40 mg/kg" required />
                </div>

                <div className="form-input-group">
                  <label>{t('form.potassium')}</label>
                  <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="e.g., 30 mg/kg" required />
                </div>

                <div className="form-input-group">
                  <label>{t('form.temperature')}</label>
                  <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g., 25.5°C" required />
                </div>

                <div className="form-input-group">
                  <label>{t('form.humidity')}</label>
                  <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g., 70%" required />
                </div>

                <div className="form-input-group">
                  <label>{t('form.ph')}</label>
                  <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5 pH" required />
                </div>

                <div className="form-input-group full-row">
                  <label>{t('form.rainfall')}</label>
                  <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="e.g., 150.0 mm" required />
                </div>
              </div>

              <button type="submit" className="action-button" disabled={loading || showGiftBox}>
                {loading ? <><div className="spinner-small"></div> {loadingText}</> : 
                 showGiftBox ? t('form.unboxing') : (t('form.submit') || 'Predict Best Crop')}
              </button>
            </form>
          </>
        ) : (
          <div className="report-analysis-section">
            <div className="report-upload-box">
              <div className="upload-icon">
                <i className="fas fa-file-medical-alt"></i>
              </div>
              <h3>{t('form.report_title') || 'AI Report Analysis'}</h3>
              <p>{t('form.report_desc') || 'Upload your Soil Test Report (PDF/Word/Image) and our AI will extract values automatically to predict the best crop for you.'}</p>
              
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                ref={reportInputRef} 
                onChange={handleReportAnalysis} 
                style={{ display: 'none' }} 
              />
              
              <button 
                type="button" 
                className="btn-report-upload" 
                onClick={triggerReportUpload}
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner-small"></div> {loadingText}</>
                ) : (
                  <><i className="fas fa-cloud-upload-alt"></i> {t('form.upload_report') || 'Upload Report & Predict'}</>
                )}
              </button>
              
              <div className="format-hint">
                Supported formats: PDF, Word (DOCX), JPG, JPEG, PNG
              </div>
            </div>

            {extractedReportData && (
              <div className="extracted-data-card">
                <div className="card-header">
                  <i className="fas fa-microscope"></i>
                  <h4>{t('form.extracted_title') || 'Extracted Soil Parameters'}</h4>
                </div>
                <div className="extracted-grid">
                  <div className="extract-item">
                    <span className="label">
                      {t('form.nitrogen')} (N)
                      {extractedReportData._isDefault?.nitrogen && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.nitrogen || '--'}</span>
                  </div>
                  <div className="extract-item">
                    <span className="label">
                      {t('form.phosphorus')} (P)
                      {extractedReportData._isDefault?.phosphorus && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.phosphorus || '--'}</span>
                  </div>
                  <div className="extract-item">
                    <span className="label">
                      {t('form.potassium')} (K)
                      {extractedReportData._isDefault?.potassium && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.potassium || '--'}</span>
                  </div>
                  <div className="extract-item">
                    <span className="label">
                      {t('form.ph')}
                      {extractedReportData._isDefault?.ph && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.ph || '--'}</span>
                  </div>
                  <div className="extract-item">
                    <span className="label">
                      {t('form.temperature')}
                      {extractedReportData._isDefault?.temperature && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.temperature ? `${extractedReportData.temperature}°C` : '--'}</span>
                  </div>
                  <div className="extract-item">
                    <span className="label">
                      {t('form.humidity')}
                      {extractedReportData._isDefault?.humidity && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.humidity ? `${extractedReportData.humidity}%` : '--'}</span>
                  </div>
                  <div className="extract-item full-row">
                    <span className="label">
                      {t('form.rainfall')}
                      {extractedReportData._isDefault?.rainfall && <span className="default-badge">{t('form.default') || 'Default'}</span>}
                    </span>
                    <span className="value">{extractedReportData.rainfall ? `${extractedReportData.rainfall} mm` : '--'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pro-tip">
              <i className="fas fa-lightbulb"></i>
              <span>{t('form.report_tip') || 'Tip: Make sure the document is clear and contains N, P, K, and pH values.'}</span>
            </div>
          </div>
        )}

        {showGiftBox && (
          <div className="gift-box-container">
            <div className="gift-box-animation">
              <div className="box-lid"></div>
              <div className="box-body"></div>
              <div className="box-ribbon"></div>
            </div>
            <p className="gift-text">{t('form.unboxing')}</p>
          </div>
        )}

        {results && (
          <div key={results.crop + Date.now()} className="interactive-result-card reveal-animation">
            <div className="result-grid">
              <div className="result-image-box">
                {results.image ? (
                  <img 
                    key={results.image + Date.now()}
                    src={results.image} 
                    alt={results.crop} 
                    className="crop-reveal-img"
                    style={{ border: '1px solid #eee' }}
                    onError={(e) => {
                      console.error('IMAGE LOAD ERROR:', results.image);
                      e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                ) : (
                  <div className="no-image-fallback">No Image Found</div>
                )}
                <div className="crop-badge">{t('form.top_match')}</div>
              </div>
              
              <div className="result-info">
                <div className="result-label-header">
                  {t('form.result_label')}
                </div>
                <h3 className="crop-highlight-name">{results.crop}</h3>
                
                <div className="confidence-meter-container">
                  <div className="meter-label">
                    <span>{t('results.ai_confidence')}</span>
                    <span>{typeof results.confidence === 'number' ? `${(results.confidence * 100).toFixed(1)}%` : '95.0%'}</span>
                  </div>
                  <div className="meter-bg">
                    <div 
                      className="meter-fill" 
                      style={{width: `${typeof results.confidence === 'number' ? results.confidence * 100 : 95}%`}}
                    ></div>
                  </div>
                </div>

                <div className="reasons-list-modern">
                  {results.reasons.map((reason, index) => (
                    <div key={index} className="reason-item-modern">
                      <span className="check-icon"><i className="fas fa-check-circle"></i></span>
                      <p>{reason}</p>
                    </div>
                  ))}
                </div>

                <div className="result-actions">
                  <button onClick={() => setResults(null)} className="btn-secondary">
                    {t('form.reset')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CropForm;
