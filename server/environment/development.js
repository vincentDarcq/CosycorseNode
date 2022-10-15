const path = require('path');
const { mongoPass } = require('../tokens/development');

module.exports = {
  dbUrl: `mongodb+srv://vincent:${mongoPass}@cluster0.ic0uz.mongodb.net/EventMap?retryWrites=true&w=majority`,
  cert: path.join(__dirname, '../ssl/cert.pem'),
  key: path.join(__dirname, '../ssl/key.pem'),
  portHttp: 300,
  portHttps: 443,
  apiUrl: "https://localhost"
}