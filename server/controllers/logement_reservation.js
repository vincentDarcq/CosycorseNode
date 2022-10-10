const fs = require('fs');
const util = require('util');
const path = require('path');
const {
    createLogementReservation,
    getReservationsBylogementId
} = require('../queries/logement_reservation.queries');

const {
    newLogementReservation,
} = require('../models/logement_reservation.model');


exports.create = async (req, res, next) => {
    const logementReservation = newLogementReservation(req);
    const lr = await createLogementReservation(logementReservation);
    return next();
}

exports.getReservations = async (req, res, next) => {
    const logementReservations = await getReservationsBylogementId(req.query.logementId);
    res.status(200).json(logementReservations);
}