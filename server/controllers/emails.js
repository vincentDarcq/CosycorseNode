const nodeMailer = require('nodemailer');
const {
  user,
  password
} = require('../rsa/nodemailerpass');
const { getUserByMail } = require('../queries/user.queries');
const env = require(`../environment/${process.env.NODE_ENV}`);

const transporter = nodeMailer.createTransport({
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

let mailOptions = (to, subject, text, html) => {
  return {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html
  };
}

exports.contactHost = async (req, res, next) => {
  const html =  `<b>Vous avez un message :</b>
                <br><br>${req.body.message}<br>
                <b>Répondre à : ${req.body.from}</b>`
  let options = mailOptions(req.body.to, req.body.subject, req.body.message, html);

  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("mail sent succefully");
  });
}

exports.forgotPassword = async (req, res, next) => {
  const html = `<b>Vous pouvez changer votre mot de passe en cliquant sur le lien suivant :</b><br><br>
                <a style="border: solid 1px green; padding: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/reset_password/${res.locals.token}">Changer mon mot de passe</a><br><br>
                <b>Attention, ce lien n'est valable que 15 minutes</b>`
  let options = mailOptions(req.query.mail, "Mot de passe oublié", req.body.message, html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un email a été envoyé à votre adresse");
  });
}

exports.sendMailForBooking = async (req, res, next) => {
  const html = `<b>Vous avez une demande de réservation :</b>
                <br><br>dates : ${req.body.dateDebut} - ${req.body.dateFin}<br>
                <p>${req.body.message}</p
                <b>Vous pouvez contacter le demandeur à l'adresse : ${req.body.emailDemandeur}</b><br><br>
                <div style="display: flex; flex-direction: row; margin: 5% 35%;">
                <a style="border: solid 1px green; padding: 5px; margin: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/reponseLogementReservation/${res.locals.lr._id}">Accepter/Refuser</a>
                </div>`
  let options = mailOptions(req.body.emailAnnonceur, "Demande de réservation", req.body.message, html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Demande envoyée avec succès");
  });
}

exports.sendConfirmationForLogementReservation = async (req, res, next) => {
  const html = `<b>Votre demande de réservation pour la Corse a été acceptée ! <br>
                <p>${res.locals.logement.ville}</p><br>
                <p>${res.locals.logement.adresse}</p><br>
                <a style="border: solid 1px green; padding: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/logement/${res.locals.logement._id}">Voir l'annonce</a><br><br>
                <b>Vous pouvez annuler 48h à l'avance en allant sur votre compte</b><br><br><br>
                <a style="border: solid 1px green; padding: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/mon_compte">Mon compte</a>`
  let options = mailOptions(res.locals.lr.emailDemandeur, "Vous partez pour la Corse !", "Demande acceptée !", html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail de confirmation a été envoyé au voyageur");
  });
}

exports.sendRejectionForLogementReservation = async (req, res, next) => {
  const html = `<b>Votre demande de réservation pour l'adresse ${res.locals.logement.adresse} en Corse a été refusée<br><br>
                <p>Faites une nouvelle réservation :</p>
                <a style="border: solid 1px green; padding: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/logements">Voir les annonces de Cosycorse</a>`
  let options = mailOptions(res.locals.lr.emailDemandeur, "Demande refusée", "Demande refusée", html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail de refus a été envoyé au voyageur");
  });
}