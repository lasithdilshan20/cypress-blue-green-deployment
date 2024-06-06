const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = process.env.CYPRESS_BASE_URL || 'http://localhost:3001';
      return config;
    },
  },
});
