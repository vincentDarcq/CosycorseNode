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

exports.getLogementsByFiltres = (ville, voyageurs, lits, sdbs, prix_max, equipements) => {
  return Logement.find({
     ville: ville ? ville : {$exists: true}, 
     voyageurs: voyageurs ? {$gte : voyageurs} : {$exists: true},
     lits: lits ? {$gte : lits} : {$exists: true},
     sdbs: sdbs? {$gte : sdbs} : {$exists: true},
     prix: prix_max ? {$lte : prix_max} : {$exists: true},
     equipements: (equipements && equipements.length > 0) ? {$all : equipements} : {$exists: true}
  }).exec();
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