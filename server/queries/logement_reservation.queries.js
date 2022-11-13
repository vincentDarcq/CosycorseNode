const LogementReservation = require('../models/logement_reservation.model');
const ObjectId = require('mongodb').ObjectId;

let saveLogementReservation = (logementReservation) => {
  return logementReservation.save();
}

let updateLogementReservation = (logementReservation) => {
  return LogementReservation.findByIdAndUpdate({ _id: logementReservation._id }, logementReservation, {new: true})
}

let findReservationsBylogementId = (logementId) => {
  return LogementReservation.find({ logementId : ObjectId(logementId) }).exec();
}

let findReservationsByEmailDemandeur = (userEmail) => {
  return LogementReservation.find({ emailDemandeur : userEmail }).exec();
}

let findReservationsByEmailAnnonceur = (userEmail) => {
  return LogementReservation.find({ emailAnnonceur : userEmail }).exec();
}

let getLogementReservationById = (logementReservationId) => {
  return LogementReservation.findById(logementReservationId).exec();
}

let deleteLogementReservationById = (logementReservationId) => {
  return LogementReservation.findByIdAndDelete(logementReservationId).exec();
}

let findLogementReservationsAcceptedAndNotPayed = () => {
  return LogementReservation.find({ status : "acceptée", paye: false }).exec();
}

module.exports = {
  saveLogementReservation,
  updateLogementReservation,
  findReservationsBylogementId,
  findReservationsByEmailDemandeur,
  findReservationsByEmailAnnonceur,
  getLogementReservationById,
  deleteLogementReservationById,
  findLogementReservationsAcceptedAndNotPayed
}
  