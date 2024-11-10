// src/config.js
const config = {
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
      featureFlag: true 
  };
    
  export default config;