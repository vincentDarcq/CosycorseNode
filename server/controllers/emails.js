const nodeMailer = require('nodemailer');
const {
  user,
  password
} = require('../rsa/nodemailerpass');
const { findUserByMail } = require('../queries/user.queries');
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

let contactHost = async (req, res, next) => {
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

let forgotPassword = async (req, res, next) => {
  const html = 
  `<div style="
            background-color: white;
            text-align: center;
          ">
    <b>Vous pouvez changer votre mot de passe en cliquant sur le lien suivant :</b>
    <br>
    <a style="border: solid 1px green; padding: 5px; background-color: green; color: white; text-decoration :none;" href="${env.apiUrl}/reset_password/${res.locals.token}">Changer mon mot de passe</a>
    <br>
    <b>Attention, ce lien n'est valable que 15 minutes</b>
  </div>`;

  let options = mailOptions(req.query.mail, "Mot de passe oublié", req.body.message, html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un email a été envoyé à votre adresse");
  });
}

let sendMailForBooking = async (req, res, next) => {
  const html = 
  `<div style="
            background-color: white;
            text-align: center;
          ">
    <p><b>Vous avez une demande de réservation :</b></p>
    dates : ${req.body.dateDebut} - ${req.body.dateFin}<br>
    <p>${req.body.message}</p>
    <p>Vous pouvez contacter le demandeur à l'adresse : ${req.body.emailDemandeur}</p>
    <p>
      Vous pouvez accepter ou refuser sur votre compte (vous devrez vous identifier avant): 
      <br>
      <a href="${env.apiUrl}/mon_compte">
        Mon Compte
      </a>
    </p>
    <p>Ou directement par ici (sans vous identifier):</p>
    <a style="
          border: solid 1px green; 
          padding: 5px; margin: 15px; 
          background-color: green;
          text-decoration :none;
          color: black;
        " 
      href="${env.apiUrl}/reponseLogementReservation/${res.locals.lr._id}">
      Accepter/Refuser
    </a>
  </div>`;

  let options = mailOptions(req.body.emailAnnonceur, "Demande de réservation", req.body.message, html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Demande envoyée avec succès");
  });
}

let sendConfirmationForLogementReservation = async (req, res, next) => {
  const html = 
  `<div style="
          background-color: white;
          text-align: center;
        ">
    <p><b>Votre demande de réservation pour la Corse a été acceptée ! </b></p>
    <p>${res.locals.logement.ville}</p>
    <p>${res.locals.logement.adresse}</p>
    <a style="
          border: solid 1px green; 
          padding: 5px; 
          background-color: green; 
          text-decoration :none;
        " 
      href="${env.apiUrl}/logement/${res.locals.logement._id}">
      Voir l'annonce
    </a>
    <p><b>Vous pouvez annuler minimum 48h à l'avance en allant sur votre compte</b></p>
    <a style="
          border: solid 1px green; 
          padding: 5px; 
          background-color: green; 
          text-decoration :none;
        " 
      href="${env.apiUrl}/mon_compte">
      Mon compte
    </a>
  </div>`;
  
  let options = mailOptions(res.locals.lr.emailDemandeur, "Vous partez pour la Corse !", "Demande acceptée !", html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail de confirmation a été envoyé au voyageur");
  });
}

let sendRejectionForLogementReservation = async (req, res, next) => {
  const html = 
  `<div style="
            background-color: white;
            text-align: center;
          ">
    <p><b>Votre demande de réservation pour l'adresse ${res.locals.logement.adresse} en Corse a été refusée</b></p>
    <p>Faites une nouvelle réservation :</p>
    <a style="
            border: solid 1px green; 
            padding: 5px; 
            background-color: green; 
            text-decoration :none;
          " 
        href="${env.apiUrl}/logements">Voir les annonces de Cosycorse
    </a>
  </div>`
  let options = mailOptions(res.locals.lr.emailDemandeur, "Demande refusée", "Demande refusée", html);
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
  const html = req.body.message.length > 0 ? 
    `<div style="
              background-color: white;
              text-align: center;
            ">
      <p><b>Nous sommes désolé d'apporter une mauvaise nouvelle :</b></p>
      <p>
        ${customer.firstName } ${customer.lastName} 
        vient d'annuler sa réservation pour votre logement situé au 
        ${req.body.monCompteReservation.logement.adresse}
        <br>
        Il vous a laissé un message : 
        <br>
        ${req.body.message}
      </p>
    </div>` 
    : 
    `<div style="
              background-color: white;
              text-align: center;
            ">
      <p><b>Nous sommes désolé d'apporter une mauvaise nouvelle :</b></p>
      <p>
        ${customer.firstName } ${customer.lastName} 
        vient d'annuler sa réservation pour votre logement situé au 
        ${req.body.monCompteReservation.logement.adresse}
      </p>
    </div>`
  let options = mailOptions(req.body.monCompteReservation.logementReservation.emailAnnonceur, "Reservation annulée", "Reservation annulée", html);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.status(200).json("Un mail d'annulation vient d'être envoyé à l'hôte");
  });
}

let sendCancelationFromHostForLogementReservation = async (req, res, next) => {
  const customer = await findUserByMail(req.body.monCompteReservation.logementReservation.emailAnnonceur);
  const html = 
  `<div style="
            background-color: white;
            text-align: center;
          ">
    <p><b>Nous sommes désolé d'apporter une mauvaise nouvelle :</b></p>
    <p>
      ${customer.firstName } ${customer.lastName} 
      vient d'annuler votre réservation pour le logement situé au 
      ${req.body.monCompteReservation.logement.adresse}
    </p>
    <p>
      Il vous a laissé le message suivant : 
      <br> 
      ${req.body.message}
    </p>
  </div`;
  let options = mailOptions(req.body.monCompteReservation.logementReservation.emailDemandeur, "Reservation annulée", "Reservation annulée", html);
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
  forgotPassword,
  sendMailForBooking,
  sendConfirmationForLogementReservation,
  sendRejectionForLogementReservation,
  sendCancelationFromTravelerForLogementReservation,
  sendCancelationFromHostForLogementReservation
}