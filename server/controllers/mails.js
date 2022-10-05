const nodeMailer = require('nodemailer');
const {
  user,
  pass
} = require('../rsa/nodemailerpass');
const { getUserByName } = require('../queries/user.queries');

exports.sendMail = async (req, res, next) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass
    }
  });
  const annonceur = await getUserByName(req.body.to);
  let mailOptions = {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>', // sender address
    to: annonceur.email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.message, // plain text body
    html: `<b>Vous avez un message :</b><br><br>${req.body.message}<br><b>Réponse : ${req.body.from}</b>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("mail sent succefully");
  });
}