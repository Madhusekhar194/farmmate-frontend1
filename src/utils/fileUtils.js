import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

// Set worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts text from an Image file (OCR)
 */
export const extractTextFromImage = async (file) => {
  console.log('Starting OCR for file:', file.name, file.type);
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    console.log('OCR Extraction Complete. Text length:', result.data.text.length);
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to read text from image. Please ensure the photo is clear.');
  }
};

/**
 * Maps CSV fields to our form state fields
 */
const MAPPING = {
  'n': 'nitrogen',
  'nitrogen': 'nitrogen',
  'p': 'phosphorus',
  'phosphorus': 'phosphorus',
  'k': 'potassium',
  'potassium': 'potassium',
  'temp': 'temperature',
  'temperature': 'temperature',
  'hum': 'humidity',
  'humidity': 'humidity',
  'ph': 'ph',
  'rain': 'rainfall',
  'rainfall': 'rainfall'
};

export const parseCSVData = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const rawData = results.data[0];
          const mappedData = {};
          
          Object.keys(rawData).forEach(key => {
            const normalizedKey = key.toLowerCase().trim();
            if (MAPPING[normalizedKey]) {
              mappedData[MAPPING[normalizedKey]] = rawData[key];
            }
          });
          
          resolve(mappedData);
        } else {
          reject(new Error('No data found in CSV file'));
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Extracts text from a PDF file
 */
export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }
  
  return fullText;
};

/**
 * Extracts text from a Word (.docx) file
 * Improved to handle tables better by converting to HTML first
 */
export const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  // We use convertToHtml to preserve some structure, specifically table cells
  const result = await mammoth.convertToHtml({ arrayBuffer });
  
  // Replace table cell/row tags with distinctive separators to keep values separate
  const structuredText = result.value
    .replace(/<\/td>/g, ' | ')
    .replace(/<\/tr>/g, '\n')
    .replace(/<[^>]+>/g, ' '); // Strip all other tags
    
  return structuredText;
};

/**
 * Parses soil parameters from raw text using regex
 */
/**
 * Parses soil parameters from raw text using regex
 */
export const parseSoilParameters = (text) => {
  const results = {};
  
  // Clean text: normalize whitespace and common OCR/Table misreadings
  const cleanText = text
    .replace(/[\|\[\]\(\)\{\}\*+_]/g, ' ') // remove common noisy characters and table borders
    .replace(/\b(?:20[12]\d|203[0-5])\b/g, ' ') // Remove typical years (2010-2035) to prevent misreading as data
    .replace(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, ' ') // Remove dates (DD/MM/YYYY)
    .replace(/(\d)[oO]/g, '$10')        // misread zero as O after a digit
    .replace(/[oO](\d)/g, '0$1')        // misread zero as O before a digit
    .replace(/\s+/g, ' ')               // normalize whitespace
    .toLowerCase();

  console.log('Cleaned Text for Parsing:', cleanText);

  // 1. GRID TABLE EXTRACTION (Header Row followed by Data Row)
  // This handles cases where labels are in one row and values in another
  const lines = text.split('\n').map(l => l.toLowerCase().trim()).filter(l => l.length > 2);
  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i+1];
    
    const possibleLabels = [
      { key: 'nitrogen', match: /\b(?:nitrogen|n)\b/i },
      { key: 'phosphorus', match: /\b(?:phosphorus|p)\b/i },
      { key: 'potassium', match: /\b(?:potassium|k)\b/i },
      { key: 'ph', match: /\b(?:ph|p\s+h|p\.h)\b/i },
      { key: 'temperature', match: /\b(?:temperature|temp|t)\b/i },
      { key: 'humidity', match: /\b(?:humidity|hum|h)\b/i },
      { key: 'rainfall', match: /\b(?:rainfall|rain|r|mm)\b/i }
    ];

    const foundLabels = possibleLabels.filter(item => currentLine.match(item.match));

    if (foundLabels.length >= 2) {
      const numbersInNext = nextLine.match(/(\d+(?:\.\d+)?)/g);
      if (numbersInNext && numbersInNext.length >= foundLabels.length) {
        // Zip labels to numbers by order of appearance
        foundLabels.forEach((labelObj, idx) => {
          if (!results[labelObj.key]) results[labelObj.key] = numbersInNext[idx];
        });
      }
    }
  }

  // 2. STANDARD REGEX (Label: Value)
  const patterns = {
    nitrogen: /(?:nitrogen|nit|ni|n)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    phosphorus: /(?:phosphorus|phos|p)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    potassium: /(?:potassium|pot|k)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    temperature: /(?:temperature|temp|temp\.|t|celsius|degree)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    humidity: /(?:humidity|hum|hum\.|hummidity|h)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    ph: /(?:ph|p\.h|p\s+h)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i,
    rainfall: /(?:rainfall|rain|rain\.|r|mm|precipitation)\s*[:=~\-\.]*\s*(\d+(?:\.\d+)?)/i
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    if (!results[key]) {
      const match = cleanText.match(pattern);
      if (match) {
        results[key] = match[1];
      }
    }
  });

  // 3. VALUE-FIRST/UNIT-FIRST (Catching "25 C" or "100mm" without label)
  if (!results.temperature) {
    const tempMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:celsius|degree|°c|° c)/i);
    if (tempMatch) results.temperature = tempMatch[1];
  }
  if (!results.humidity) {
    const humMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:%|percentage|humidity)/i);
    if (humMatch) results.humidity = humMatch[1];
  }
  if (!results.rainfall) {
    const rainMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:mm|millimeter|rainfall)/i);
    if (rainMatch) results.rainfall = rainMatch[1];
  }

  return results;
};
