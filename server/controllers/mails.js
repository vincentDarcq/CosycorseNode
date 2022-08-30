const {
  forgotPassword
} = require('../config/nodemailer');

exports.forgotPassword = async (req, res, next) => {
  forgotPassword(req.body.mail, res);
}