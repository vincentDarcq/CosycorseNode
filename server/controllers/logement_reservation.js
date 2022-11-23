const {
    saveLogementReservation,
    findReservationsBylogementId,
    getLogementReservationById,
    updateLogementReservation,
    findReservationsByEmailDemandeur,
    findReservationsByEmailAnnonceur
} = require('../queries/logement_reservation.queries');

const {
    getLogementById
} = require('../queries/logement.queries');

const { 
    STRIPE_SECRET_KEY
} = require(`../tokens/${process.env.NODE_ENV}`)

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { newRemboursement } = require('../models/remboursement_stripe.model');
const { createRemboursement } = require('../queries/remboursement.queries');
const { 
    cancelation_not_possible_after_48h, 
    not_cancel_because_empty_message 
} = require('../utils/reponses');

let create = async (req, res, next) => {
    res.locals.lr =  await saveLogementReservation(req);
    next();
}

let getReservationsByLogementId = async (req, res, next) => {
    const logementReservations = await findReservationsBylogementId(req.query.logementId);
    res.status(200).json(logementReservations);
}

let getReservationsByEmailDemandeur = async (req, res, next) => {
    const logementReservations = await findReservationsByEmailDemandeur(req.query.userEmail);
    res.status(200).json(logementReservations);
}

let getReservationsByEmailAnnonceur = async (req, res, next) => {
    const logementReservations = await findReservationsByEmailAnnonceur(req.query.userEmail);
    res.status(200).json(logementReservations);
}

let getReservationByLogementReservationId = async (req, res, next) => {
    const logementReservation = await getLogementReservationById(req.query.logementReservationId);
    if(logementReservation){
        res.status(200).json(logementReservation);
    }else {
        res.status(404).json({});
    }
}

let accepteReservation = async (req, res, next) => {
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
        res.status(500).json(e);
    }
}

let rejectReservation = async (req, res, next) => {
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

let cancelReservation = async (req, res, next) => {
    try {
        let lr;
        let logement;
        if(req.body.monCompteReservation){
            lr = req.body.monCompteReservation.logementReservation;
            logement = req.body.monCompteReservation.logement;
        }else {
            lr = req.body.monCompteVoyage.logementReservation;
            logement = req.body.monCompteVoyage.logement;
        }
        const formattedDate = lr.dateDebut.split('/')[1] + "/" + lr.dateDebut.split('/')[0] + "/" + lr.dateDebut.split('/')[2];
        let dateDebut = new Date(formattedDate);
        dateDebut.setHours(dateDebut.getHours() + 1);
        let now = new Date();
        now.setHours(now.getHours() + 1);
        const delais = dateDebut.getTime() - now.getTime();
        const jours = Math.floor((delais / 1000) / 3600) / 24;
        let refund;
        if(jours >= 2){
            if(req.query.fromHost === "fromHost"){
                if(req.body.message.length === 0){
                    res.status(400).json(not_cancel_because_empty_message);
                }else {
                    refund = await refundCustomer(logement, lr, 'host', req.body.message);
                }
            }else {
                refund = await refundCustomer(logement, lr, 'customer', req.body.message);
            }
            lr.status = "annulée";
            console.log(lr);
            createRemboursement(newRemboursement(refund));
            updateLogementReservation(lr);
            next();
        }else {
            res.status(409).json(cancelation_not_possible_after_48h);
        }
    }catch(e){
        res.status(500).json("L'erreur suivante s'est produite: "+e);
    }
}

module.exports = {
    create,
    getReservationsByLogementId,
    getReservationsByEmailDemandeur,
    getReservationsByEmailAnnonceur,
    getReservationByLogementReservationId,
    accepteReservation,
    rejectReservation,
    cancelReservation
}

let refundCustomer = async (logement, lr, from, message) => {
    return await stripe.refunds.create({
        payment_intent: lr.pi,
        reason: 'requested_by_customer',
        refund_application_fee: false,
        metadata: {
            emailAnnonceurLogement: logement.emailAnnonceur,
            emailDemandeurLogement: lr.emailDemandeur,
            adresseLogement: logement.adresse,
            debutReservation: lr.dateDebut,
            finReservation: lr.dateFin,
            messageAnnulation: message,
            from: from
        }
    });
}

