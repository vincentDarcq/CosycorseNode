const LogementReservation = require('../models/logement_reservation.model');
const ObjectId = require('mongodb').ObjectId;

exports.saveLogementReservation = (logementReservation) => {
  return logementReservation.save();
}

exports.updateLogementReservation = (logementReservation) => {
  return LogementReservation.findByIdAndUpdate({ _id: logementReservation._id }, logementReservation, {new: true})
}

exports.getReservationsBylogementId = (logementId) => {
  return LogementReservation.find({ logementId : ObjectId(logementId) }).exec();
}

exports.getReservationsByEmailDemandeur = (userEmail) => {
  return LogementReservation.find({ emailDemandeur : userEmail }).exec();
}

exports.getLogementReservationById = (logementReservationId) => {
  return LogementReservation.findById(logementReservationId).exec();
}

exports.deleteLogementReservationById = (logementReservationId) => {
  return LogementReservation.findByIdAndDelete(logementReservationId).exec();
}
  