const router = require('express').Router();
const { 
    contactHost,
    forgotPassword
 } = require('../controllers/emails');


router.get('/forgotPass', forgotPassword);
router.post('/contactHost', contactHost);

module.exports = router;