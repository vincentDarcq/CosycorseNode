const router = require('express').Router();
const {
    create,
    getReservationsByLogementId,
    accepteReservation,
    rejectReservation,
    getReservationsByEmailDemandeur
} = require('../controllers/logement_reservation');
const { 
    sendMailForBooking,
    sendConfirmationForLogementReservation
 } = require('../controllers/emails');

router.post('/create', create, sendMailForBooking);
router.get('/getReservationsByLogementId', getReservationsByLogementId);
router.get('/getReservationsByDemandeurEmail', getReservationsByEmailDemandeur);
router.get('/accepteReservation', accepteReservation, sendConfirmationForLogementReservation);
router.get('/rejectReservation', rejectReservation);

module.exports = router;