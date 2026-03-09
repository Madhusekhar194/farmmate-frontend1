import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:9090'; 

export const getCropRecommendation = async (formData) => {
  try {

    const requestData = {
      N: parseFloat(formData.nitrogen),
      P: parseFloat(formData.phosphorus),
      K: parseFloat(formData.potassium),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall)
    };
                  
    const response = await axios.post(`${API_BASE_URL}/predict`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const getMockRecommendation = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const crops = ['Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton', 'Sugarcane'];
  const randomCrop = crops[Math.floor(Math.random() * crops.length)];
  
  return {
    recommendedCrop: randomCrop,
    confidence: Math.random() * 0.5 + 0.5,
  };
};