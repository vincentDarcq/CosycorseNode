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
    let logementReservation = await getLogementReservationById(req.query.logementReservationId);
    if(logementReservation){
        if(logementReservation.accepte){
            res.status(409).json({});
        }else {
            logementReservation.accepte = true;
            res.locals.lr = await updateLogementReservation(logementReservation);
            res.locals.logement = await getLogementById(res.locals.lr.logementId);
            next();
        }
    }else {
        res.status(404).json({});
    }
}

exports.rejectReservation = async (req, res, next) => {
    res.locals.lr = await deleteLogementReservationById(req.query.logementReservationId);
    res.locals.logement = await getLogementById(res.locals.lr.logementId);
    next();
}

exports.cancelReservation = async (req, res, next) => {
    let formattedDate = req.body.monCompteReservation.logementReservation.dateDebut.split('/')[1] + "/" + req.body.monCompteReservation.logementReservation.dateDebut.split('/')[0] + "/" + req.body.monCompteReservation.logementReservation.dateDebut.split('/')[2]
    let dateDebut = new Date(formattedDate);
    dateDebut.setHours(dateDebut.getHours() + 1);
    let now = new Date();
    now.setHours(now.getHours() + 1);
    const delais = dateDebut.getTime() - now.getTime();
    const jours = Math.floor((delais / 1000) / 3600) / 24;
    if(jours >= 2){
        deleteLogementReservationById(req.body.monCompteReservation.logementReservation._id);
        next();
    }else {
        res.status(409).json("Une annulation n'est possible que 48h à l'avance, vous avez passé ce délais");
    }
}