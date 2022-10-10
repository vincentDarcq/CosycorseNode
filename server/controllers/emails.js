const nodeMailer = require('nodemailer');
const {
  user,
  password
} = require('../rsa/nodemailerpass');
const { getUserByName } = require('../queries/user.queries');
const env = require(`../environment/${process.env.NODE_ENV}`);

let transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: password
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.contactHost = async (req, res, next) => {
  const annonceur = await getUserByName(req.body.to);
  let mailOptions = {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>', // sender address
    to: annonceur.email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.message, // plain text body
    html: 
    `<b>Vous avez un message :</b>
    <br><br>${req.body.message}<br>
    <b>Répondre à : ${req.body.from}</b>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("mail sent succefully");
  });
}

exports.sendMailForBooking = async (req, res, next) => {
  const annonceur = await getUserByName(req.body.annonceur);
  let mailOptions = {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>', // sender address
    to: annonceur.email, // list of receivers
    subject: "Demande de réservation", // Subject line
    text: req.body.message, // plain text body
    html: 
    `<b>Vous avez une demande de réservation :</b>
    <br><br>dates : ${req.body.dateDebut} - ${req.body.dateFin}<br>
    <p>${req.body.message}</p
    <b>Vous pouvez contacter le demandeur à l'adresse : ${req.body.emailDemandeur}</b><br>
    <a style="border: solid 1px green; margin: auto; color: white;" href="${env.apiUrl}">Accepter/Refuser</a>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Demande envoyée avec succès");
  });
}

exports.forgotPassword = async (req, res, next) => {
  let mailOptions = {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>', // sender address
    to: req.query.mail, // list of receivers
    subject: "Mot de passe oublié", // Subject line
    text: req.body.message, // plain text body
    html: 
    `<b>Vous pouvez changer votre mot de passe en cliquant sur le lien suivant :</b>
    <a style="border: solid 1px green; margin: auto; color: white;" href="${env.apiUrl}/reset_password/${res.locals.token}">Changer mon mot de passe</a><\t>
    <b>Attentetion, ce lien n'est valable que 15 minutes</b>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un email a été envoyé à votre adresse");
  });
}