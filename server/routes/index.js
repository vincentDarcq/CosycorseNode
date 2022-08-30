const router = require('express').Router();
const auth = require('./auth');
const logement = require('./logement');

router.use('/api/auth', auth);
router.use('/api/logements', logement);


module.exports = router;
