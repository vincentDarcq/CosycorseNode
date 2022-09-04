const Logement = require('../models/logement.model');

exports.createLogement = (logement, res) => {
  return logement.save();
}

exports.getAllLogement = () => {
  return Logement.find({}).exec();
}

exports.getLogementByAnnonceur = (annonceur) => {
  return Logement.find({ annonceur: annonceur}).exec();
}

exports.getLogementsByVilleRecentToOld = (ville) => {
  return Logement.find({ ville: ville}).sort({createdAt: -1}).exec();
}

exports.getLogementById = (logementId) => {
  return Logement.findById(logementId).exec();
}

exports.deleteOne = (logementId) => {
  return Logement.findByIdAndDelete(logementId).exec();
}

exports.findByIdAndUpdate = (id, logement) => {
  return Logement.findByIdAndUpdate({ _id: id }, logement, {new: true})
}