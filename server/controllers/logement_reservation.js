const {
    saveLogementReservation,
    getReservationsBylogementId,
    getLogementReservationById,
    updateLogementReservation
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

exports.getReservations = async (req, res, next) => {
    const logementReservations = await getReservationsBylogementId(req.query.logementId);
    res.status(200).json(logementReservations);
}

exports.accepteReservation = async (req, res, next) => {
    let logementReservation = await getLogementReservationById(req.query.logementReservationId);
    logementReservation.accepte = true;
    res.locals.lr = await updateLogementReservation(logementReservation);
    res.locals.logement = await getLogementById(res.locals.lr.logementId);
    next();
}

exports.rejectReservation = async (req, res, next) => {
    let logementReservation = await getLogementReservationById(req.query.logementReservationId);
}