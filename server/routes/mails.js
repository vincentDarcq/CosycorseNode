const router = require('express').Router();
const { sendMail } = require('../controllers/emails');



//router.post('/forgotPass', forgotPassword);
router.post('/send-email', sendMail);

module.exports = router;