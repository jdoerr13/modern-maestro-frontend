// jest.setup.js
global.import.meta = {
  env: {
    VITE_APP_BASE_URL: 'http://localhost:3000'
  }
};
