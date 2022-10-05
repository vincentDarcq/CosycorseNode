const router = require('express').Router();
const auth = require('./auth');
const logement = require('./logement');
const mails = require('./mails');
const logementReservation = require('./logement_reservation');

router.use('/api/auth', auth);
router.use('/api/logements', logement);
router.use('/api/mails', mails);
router.use('/api/logementReservation', logementReservation);


module.exports = router;
