const router = require('express').Router();
const {
    create
} = require('../controllers/logement_reservation')

router.post('/create', create);

module.exports = router;