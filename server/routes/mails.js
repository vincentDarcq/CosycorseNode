const router = require('express').Router();

const { forgotPassword } = require('../controllers/mails');

router.post('/forgotPass', forgotPassword);

module.exports = router;