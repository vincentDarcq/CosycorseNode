const nodeMailer = require('nodemailer');
const {
  user,
  password
} = require('../rsa/nodemailerpass');
const { findUserByMail } = require('../queries/user.queries');
const env = require(`../environment/${process.env.NODE_ENV}`);
const { pugEngine } = require("nodemailer-pug-engine");

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

transporter.use('compile', pugEngine({
  templateDir: __dirname + '/../mail_templates',
  pretty: true
}));

let mailOptions = (to, subject, template, context) => {
  return {
    from: '"Cosycorse" <vincent.darcqf78@gmail.com>',
    to: to,
    subject: subject,
    template: template,
    ctx: context
  };
}

let contactHost = async (req, res, next) => {
  const ctx = {
    message: req.body.message,
    mail: req.body.mail
  }
  let options = mailOptions(req.body.to, req.body.subject, 'contact_host', ctx);

  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("mail sent succefully");
  });
}

let contact = async (req, res, next) => {
  const ctx = {
    message: req.body.message,
    contact: req.body.mail
  }
  const options = mailOptions('vincent.darcq@hotmail.fr', req.body.motif, 'contact', ctx)
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("mail sent succefully");
  });
}

let forgotPassword = async (req, res, next) => {
  const ctx = {
    url: env.apiUrl,
    token: res.locals.token
  }
  let options = mailOptions(req.query.mail, "Mot de passe oublié", 'forgot_pass', ctx);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un email a été envoyé à votre adresse");
  });
}

let sendMailForBooking = async (req, res, next) => {
  const ctx = {
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
    message: req.body.message,
    emailDemandeur: req.body.emailDemandeur,
    url: env.apiUrl,
    lrId: res.locals.lr._id
  }
  let options = mailOptions(req.body.emailAnnonceur, "Demande de réservation", 'booking_request', ctx);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Demande envoyée avec succès");
  });
}

let sendConfirmationForLogementReservation = async (req, res, next) => {
  const ctx = {
    ville: req.body.dateDebut,
    adresse: req.body.dateFin,
    url: env.apiUrl,
    logementId: res.locals.logement._id
  }
  let options = mailOptions(res.locals.lr.emailDemandeur, "Vous partez pour la Corse !", "booking_confirm", ctx);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail de confirmation a été envoyé au voyageur");
  });
}

let sendRejectionForLogementReservation = async (req, res, next) => {
  const ctx = {
    adresse: res.locals.logement.adresse,
    url: env.apiUrl
  }
  let options = mailOptions(res.locals.lr.emailDemandeur, "Demande refusée", "booking_rejected", ctx);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail de refus a été envoyé au voyageur");
  });
}

let sendCancelationFromTravelerForLogementReservation = async (req, res, next) => {
  const customer = await findUserByMail(req.body.monCompteReservation.logementReservation.emailDemandeur);
  const ctx = {
    prenom: customer.firstName,
    nom: customer.lastName,
    adresse: req.body.monCompteReservation.logement.adresse,
    message: req.body.message
  }
  let options = req.body.message.length > 0 ? 
        mailOptions(req.body.monCompteReservation.logementReservation.emailAnnonceur, "Reservation annulée", "booking_canceled_from_traveler_with_message", ctx)
        : mailOptions(req.body.monCompteReservation.logementReservation.emailAnnonceur, "Reservation annulée", "booking_canceled_from_traveler", ctx)
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail d'annulation vient d'être envoyé à l'hôte");
  });
}

let sendCancelationFromHostForLogementReservation = async (req, res, next) => {
  const annonceur = await findUserByMail(req.body.monCompteReservation.logementReservation.emailAnnonceur);
  const ctx = {
    prenom: annonceur.firstName,
    nom: annonceur.lastName,
    adresse: req.body.monCompteReservation.logement.adresse,
    message: req.body.message
  }
  let options = mailOptions(req.body.monCompteReservation.logementReservation.emailDemandeur, "Reservation annulée", "booking_canceled_from_host", ctx);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail d'annulation vient d'être envoyé au voyageur");
  });
}

module.exports = {
  contactHost,
  contact,
  forgotPassword,
  sendMailForBooking,
  sendConfirmationForLogementReservation,
  sendRejectionForLogementReservation,
  sendCancelationFromTravelerForLogementReservation,
  sendCancelationFromHostForLogementReservation
}