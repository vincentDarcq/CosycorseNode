const router = require('express').Router();
const auth = require('./auth');
const logement = require('./logement');
const mails = require('./mails');

router.use('/api/auth', auth);
router.use('/api/logements', logement);
router.use('/api/mails', mails);


module.exports = router;
