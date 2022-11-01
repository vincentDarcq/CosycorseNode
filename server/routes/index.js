const router = require('express').Router();
const auth = require('./auth');
const logement = require('./logement');
const mails = require('./mails');
const logementReservation = require('./logement_reservation');
const user = require('./user');
const lieu = require('./lieu');
const stripe_config = require('../stripe/config');
const stripe_paiments = require('../stripe/paiement');

router.use('/api/auth', auth);
router.use('/api/logements', logement);
router.use('/api/mails', mails);
router.use('/api/logementReservation', logementReservation);
router.use('/api/user', user);
router.use('/api/lieu', lieu);
router.use('/api/stripe', stripe_config);
router.use('/api/stripe/paiments', stripe_paiments);


module.exports = router;
