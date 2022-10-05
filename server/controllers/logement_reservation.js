const fs = require('fs');
const util = require('util');
const path = require('path');
const {
    createLogementReservation,
} = require('../queries/logement_reservation.queries');

const {
    newLogementReservation,
} = require('../models/logement_reservation.model');


exports.create = async (req, res) => {
    const logementReservation = newLogementReservation(req, res);
    const lr = await createLogementReservation(logementReservation);
    res.status(200).json(lr);
}