const Logement = require('../models/logement.model');

let createLogement = (logement) => {
  return logement.save();
}

let getAllLogement = () => {
  return Logement.find({}).exec();
}

let getLogementByEmailAnnonceur = (emailAnnonceur) => {
  return Logement.find({ emailAnnonceur: emailAnnonceur }).exec();
}

let getLogementsByVilleRecentToOld = (ville) => {
  return Logement.find({ ville: ville, exposer: true}).sort({createdAt: -1}).exec();
}

let getLogementsByFiltres = (ville, voyageurs, lits, sdbs, prix_max, equipements) => {
  return Logement.find({
     ville: ville ? ville : {$exists: true}, 
     voyageurs: voyageurs ? {$gte : voyageurs} : {$exists: true},
     lits: lits ? {$gte : lits} : {$exists: true},
     sdbs: sdbs? {$gte : sdbs} : {$exists: true},
     prix: prix_max ? {$lte : prix_max} : {$exists: true},
     equipements: (equipements && equipements.length > 0) ? {$all : equipements} : {$exists: true},
     exposer: true
  }).exec();
}

let getLogementById = (logementId) => {
  return Logement.findById(logementId).exec();
}

let findByIdAndUpdate = (id, logement) => {
  return Logement.findByIdAndUpdate({ _id: id }, logement, {new: true})
}

let deleteOne = (logementId) => {
  return Logement.findByIdAndDelete(logementId).exec();
}

module.exports = { 
  createLogement, 
  getAllLogement, 
  getLogementByEmailAnnonceur, 
  getLogementsByVilleRecentToOld,
  getLogementsByFiltres,
  getLogementById,
  findByIdAndUpdate,
  deleteOne
}