const router = require('express').Router();
const {
    create,
    getReservations,
    accepteReservation,
    rejectReservation
} = require('../controllers/logement_reservation');
const { 
    sendMailForBooking,
    sendConfirmationForLogementReservation
 } = require('../controllers/emails');

router.post('/create', create, sendMailForBooking);
router.get('/getReservations', getReservations);
router.get('/accepteReservation', accepteReservation, sendConfirmationForLogementReservation);
router.get('/rejectReservation', rejectReservation);

module.exports = router;