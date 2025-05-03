require('dotenv').config();

const env_config = {
    API_BASE_URL: process.env.BACKEND_URL || "http://127.0.0.1:5000"
};

module.exports = env_config;