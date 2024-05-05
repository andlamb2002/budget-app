const API_URL = process.env.NODE_ENV === 'production'
    ? 'http://165.227.178.221:5000' // Production API URL
    : 'http://localhost:5000';      // Development API URL

export default API_URL;
