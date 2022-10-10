const router = require('express').Router();
const { 
    contactHost,
    forgotPassword
 } = require('../controllers/emails');

 const { 
    generateTokenForResetPwd
 } = require('../controllers/authentication');


router.get('/forgotPass', generateTokenForResetPwd, forgotPassword);
router.post('/contactHost', contactHost);

module.exports = router;