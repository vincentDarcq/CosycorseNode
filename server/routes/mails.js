const router = require('express').Router();
const { 
    contactHost,
    contact,
    forgotPassword
 } = require('../controllers/emails');

 const { 
    generateTokenForResetPwd
 } = require('../controllers/authentication');


router.get('/forgotPass', generateTokenForResetPwd, forgotPassword);
router.post('/contactHost', contactHost);
router.post('/contact', contact);

module.exports = router;