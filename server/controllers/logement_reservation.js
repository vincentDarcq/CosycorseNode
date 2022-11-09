const {
    saveLogementReservation,
    getReservationsBylogementId,
    getLogementReservationById,
    updateLogementReservation,
    getReservationsByEmailDemandeur,
    deleteLogementReservationById
} = require('../queries/logement_reservation.queries');

const {
    newLogementReservation,
} = require('../models/logement_reservation.model');

const {
    getLogementById
} = require('../queries/logement.queries');

const { 
    STRIPE_SECRET_KEY
} = require(`../tokens/${process.env.NODE_ENV}`)

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { newRemboursement } = require('../models/remboursement_stripe.model');
const { createRemboursement } = require('../queries/remboursement.queries');

exports.create = async (req, res, next) => {
    const logementReservation = newLogementReservation(req);
    res.locals.lr =  await saveLogementReservation(logementReservation);
    return next();
}

exports.getReservationsByLogementId = async (req, res, next) => {
    const logementReservations = await getReservationsBylogementId(req.query.logementId);
    res.status(200).json(logementReservations);
}

exports.getReservationsByEmailDemandeur = async (req, res, next) => {
    const logementReservations = await getReservationsByEmailDemandeur(req.query.userEmail);
    res.status(200).json(logementReservations);
}

exports.getReservationByLogementReservationId = async (req, res, next) => {
    const logementReservation = await getLogementReservationById(req.query.logementReservationId);
    if(logementReservation){
        res.status(200).json(logementReservation);
    }else {
        res.status(404).json({});
    }
}

exports.accepteReservation = async (req, res, next) => {
    try {
        let logementReservation = await getLogementReservationById(req.query.logementReservationId);
        if(logementReservation){
            if(logementReservation.status === "acceptée"){
                res.status(409).json({});
            }else {
                logementReservation.status = "acceptée";
                res.locals.lr = await updateLogementReservation(logementReservation);
                res.locals.logement = await getLogementById(res.locals.lr.logementId);
                next();
            }
        }else {
            res.status(404).json({});
        }
    }catch(e){
        res.status(500).json("L'erreur suivante s'est produite: "+e);
    }
}

exports.rejectReservation = async (req, res, next) => {
    try {
        let logementReservation = await getLogementReservationById(req.query.logementReservationId);
        logementReservation.status === "refusée";
        res.locals.lr = await updateLogementReservation(logementReservation);
        res.locals.logement = await getLogementById(res.locals.lr.logementId);
        next();
    }catch(e){
        res.status(500).json("L'erreur suivante s'est produite: "+e);
    }
}

exports.cancelReservation = async (req, res, next) => {
    try {
        const lr = req.body.monCompteReservation.logementReservation;
        const logement = req.body.monCompteReservation.logement;
        const formattedDate = lr.dateDebut.split('/')[1] + "/" + lr.dateDebut.split('/')[0] + "/" + lr.dateDebut.split('/')[2];
        let dateDebut = new Date(formattedDate);
        dateDebut.setHours(dateDebut.getHours() + 1);
        let now = new Date();
        now.setHours(now.getHours() + 1);
        const delais = dateDebut.getTime() - now.getTime();
        const jours = Math.floor((delais / 1000) / 3600) / 24;
        if(jours >= 2){
            const refund = await stripe.refunds.create({
                payment_intent: lr.pi,
                reason: 'requested_by_customer',
                refund_application_fee: false,
                metadata: {
                    emailAnnonceurLogement: logement.emailAnnonceur,
                    emailDemandeurLogement: lr.emailDemandeur,
                    adresseLogement: logement.adresse,
                    debutReservation: lr.dateDebut,
                    finReservation: lr.dateFin,
                    messageAnnulation: req.body.message
                }
            });
            lr.status === "annulée";
            createRemboursement(newRemboursement(refund));
            updateLogementReservation(lr);
            next();
        }else {
            res.status(409).json("Une annulation n'est possible que 48h à l'avance, vous avez passé ce délais");
        }
    }catch(e){
        res.status(500).json("L'erreur suivante s'est produite: "+e);
    }
}