const router = require('express').Router();
const {
    create,
    getReservationsByLogementId,
    accepteReservation,
    rejectReservation,
    cancelReservation,
    getReservationsByEmailDemandeur,
    getReservationByLogementReservationId
} = require('../controllers/logement_reservation');
const { 
    sendMailForBooking,
    sendConfirmationForLogementReservation,
    sendRejectionForLogementReservation,
    sendCancelationForLogementReservation
 } = require('../controllers/emails');

router.post('/create', create, sendMailForBooking);
router.get('/getReservationsByLogementId', getReservationsByLogementId);
router.get('/getReservationsByDemandeurEmail', getReservationsByEmailDemandeur);
router.get('/getReservationByLogementReservationId', getReservationByLogementReservationId);
router.get('/accepteReservation', accepteReservation, sendConfirmationForLogementReservation);
router.get('/rejectReservation', rejectReservation, sendRejectionForLogementReservation);
router.post('/cancelReservation', cancelReservation, sendCancelationForLogementReservation);

module.exports = router;