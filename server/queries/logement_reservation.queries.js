const LogementReservation = require('../models/logement_reservation.model');
const ObjectId = require('mongodb').ObjectId;

exports.createLogementReservation = (logementReservation) => {
  return logementReservation.save();
}

exports.getReservationsBylogementId = (logementId) => {
  return LogementReservation.find({ logementId : ObjectId(logementId) }).exec();
}
  