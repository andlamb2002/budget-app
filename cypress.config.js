const { defineConfig } = require("cypress");
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@applitools/eyes-cypress')(module);
    },
    baseUrl: 'http://localhost:3000', 
    supportFile: false,
  },
});
