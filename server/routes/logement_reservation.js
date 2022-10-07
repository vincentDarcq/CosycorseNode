const router = require('express').Router();
const {
    create,
    getReservations
} = require('../controllers/logement_reservation');
const { 
    sendMailForBooking
 } = require('../controllers/emails');

router.post('/create', create, sendMailForBooking);
router.get('/getReservations', getReservations);

module.exports = router;