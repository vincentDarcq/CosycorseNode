const path = require('path');

module.exports = {
  dbUrl: "mongodb+srv://vincent:uTLhewpTC1@cluster0.ic0uz.mongodb.net/EventMap?retryWrites=true&w=majority",
  cert: path.join(__dirname, '../ssl/local.crt'),
  key: path.join(__dirname, '../ssl/local.key'),
  portHttp: 300,
  portHttps: 443
}