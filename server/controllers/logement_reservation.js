const {
    saveLogementReservation,
    findReservationsBylogementId,
    getLogementReservationById,
    updateLogementReservation,
    findReservationsByEmailDemandeur,
    findReservationsByEmailAnnonceur
} = require('../queries/logement_reservation.queries');

const {
    getLogementById, findByIdAndUpdate
} = require('../queries/logement.queries');

const { 
    STRIPE_SECRET_KEY
} = require(`../tokens/${process.env.NODE_ENV}`)

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { 
    createRemboursement 
} = require('../queries/remboursement.queries');
const { 
    cancelation_not_possible_after_48h, 
    not_cancel_because_empty_message, 
    invalides_dates_for_reservation
} = require('../utils/reponses');
const { getDateFromStringDate } = require('../utils/dates');

let create = async (req, res, next) => {
    try {
        const logement = await getLogementById(req.body.logementId);
        if(!logement.exposer){
            res.status(409).json(logement_not_available);
        }else {
            const reservations = await findReservationsBylogementId(req.body.logementId);
            const dd = getDateFromStringDate(req.body.dateDebut);
            const df = getDateFromStringDate(req.body.dateFin);
            let invalid = false;
            reservations.forEach(resa => {
                const dateDebutResa = getDateFromStringDate(resa.dateDebut);
                const dateFinResa = getDateFromStringDate(resa.dateFin);
                if((dd.getTime() - df.getTime() === 0)
                || (dd.getTime() - dateDebutResa.getTime() >= 0 && dd.getTime() - dateFinResa.getTime() <= 0) 
                || (df.getTime() - dateDebutResa.getTime() >= 0 && df.getTime() - dateFinResa.getTime() <= 0)
                || (dd.getTime() - dateDebutResa.getTime() <= 0 && df.getTime() - dateFinResa.getTime() >= 0)){
                    invalid = true;
                }
            });
            if(invalid){
                res.status(409).json(invalides_dates_for_reservation);
            }else {
                res.locals.lr =  await saveLogementReservation(req);
                next();
            }
        }
    }catch(e){
        res.status(500).json(e);
    }
}

let getReservationsByLogementId = async (req, res, next) => {
    try {
        const logementReservations = await findReservationsBylogementId(req.query.logementId);
        res.status(200).json(logementReservations);
    }catch(e){
        res.status(500).json(e);
    }
}

let getReservationsByEmailDemandeur = async (req, res, next) => {
    try {
        const logementReservations = await findReservationsByEmailDemandeur(req.query.userEmail);
        res.status(200).json(logementReservations);
    }catch(e){
        res.status(500).json(e);
    }
}

let getReservationsByEmailAnnonceur = async (req, res, next) => {
    try {
        const logementReservations = await findReservationsByEmailAnnonceur(req.query.userEmail);
        res.status(200).json(logementReservations);
    }catch(e){
        res.status(500).json(e);
    }
}

let getReservationByLogementReservationId = async (req, res, next) => {
    try {
        const logementReservation = await getLogementReservationById(req.query.logementReservationId);
        if(logementReservation){
            res.status(200).json(logementReservation);
        }else {
            res.status(404).json({});
        }
    }catch(e){
        res.status(500).json(e);
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
            await createRemboursement(refund);
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

