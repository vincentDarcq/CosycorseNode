const router = require('express').Router();
const {
    create,
    getReservationsByLogementId,
    accepteReservation,
    rejectReservation,
    cancelReservation,
    getReservationsByEmailDemandeur,
    getReservationsByEmailAnnonceur,
    getReservationByLogementReservationId
} = require('../controllers/logement_reservation');
const { 
    sendMailForBooking,
    sendConfirmationForLogementReservation,
    sendRejectionForLogementReservation,
    sendCancelationFromTravelerForLogementReservation,
    sendCancelationFromHostForLogementReservation
 } = require('../controllers/emails');
const { checkTokenForCreateReservation } = require('../controllers/authentication');

router.post('/create', checkTokenForCreateReservation, create, sendMailForBooking);
router.get('/getReservationsByLogementId', getReservationsByLogementId);
router.get('/getReservationsByDemandeurEmail', getReservationsByEmailDemandeur);
router.get('/getReservationsByAnnonceurEmail', getReservationsByEmailAnnonceur);
router.get('/getReservationByLogementReservationId', getReservationByLogementReservationId);
router.get('/accepteReservation', accepteReservation, sendConfirmationForLogementReservation);
router.get('/rejectReservation', rejectReservation, sendRejectionForLogementReservation);
router.post('/cancelReservationVoyageur', cancelReservation, sendCancelationFromTravelerForLogementReservation);
router.post('/cancelReservationHote', cancelReservation, sendCancelationFromHostForLogementReservation);

module.exports = router;