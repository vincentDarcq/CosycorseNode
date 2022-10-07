const router = require('express').Router();
const { 
    contactHost
 } = require('../controllers/emails');


//router.post('/forgotPass', forgotPassword);
router.post('/contactHost', contactHost);

module.exports = router;