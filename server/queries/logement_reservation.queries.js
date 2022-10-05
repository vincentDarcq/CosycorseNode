const LogementReservation = require('../models/logement_reservation.model');

exports.createLogementReservation = (LogementReservation, res) => {
    return LogementReservation.save();
  }
  