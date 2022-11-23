const Logement = require('../models/logement.model');

let createLogement = (req) => {
  return new Logement({
    adresse: req.body.adresse,
    ville: req.body.ville,
    description: req.body.description,
    logement: req.body.logement,
    voyageurs: req.body.voyageurs,
    lits: req.body.lits,
    sdbs: req.body.sdbs,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    annonceur: req.body.annonceur,
    prix: req.body.prix,
    equipements: req.body.equipements,
    fumeur: req.body.fumeur,
    animaux: req.body.animaux,
    access_handicap: req.body.access_handicap,
    exposer: true,
    images: null
  }).save();
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

let getLogementsByFiltres = (
  ville, voyageurs, lits, sdbs, prix_max, equipements, latMin, latMax, longMin, longMax) => {
  return Logement.find({
     ville: ville ? ville : {$exists: true}, 
     voyageurs: voyageurs ? {$gte : voyageurs} : {$exists: true},
     lits: lits ? {$gte : lits} : {$exists: true},
     sdbs: sdbs? {$gte : sdbs} : {$exists: true},
     prix: prix_max ? {$lte : prix_max} : {$exists: true},
     equipements: (equipements && equipements.length > 0) ? {$all : equipements} : {$exists: true},
     exposer: true,
     latitude: latMax & latMin ? { $lte: latMax, $gte: latMin } : {$exists: true}, 
     longitude: longMax & longMin ? { $lte: longMax, $gte: longMin } : {$exists: true}
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