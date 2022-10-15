const { mongoPass } = require('../tokens/development');

module.exports = {
  dbUrl: `mongodb+srv://vincent:${mongoPass}@cluster0.ic0uz.mongodb.net/EventMap?retryWrites=true&w=majority`,
  cert: '/etc/letsencrypt/live/eventmap.fr/fullchain.pem',
  key: '/etc/letsencrypt/live/eventmap.fr/privkey.pem',
  portHttp: 80,
  portHttps: 443,
  apiUrl: "https://cosycorse.fr"
}