const Lieu = require('../models/lieu.model');

let createLieu = (req) => {
    return new Lieu({
        nom: req.body.nom,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        annonceur: req.body.annonceur,
        images: null
    }).save();
}

let findAllLieux = () => {
    return Lieu.find({}).exec();
}

let findLieuById = (lieuId) => {
    return Lieu.findById(lieuId).exec();
}

let findByIdAndUpdate = (id, lieu) => {
    return Lieu.findByIdAndUpdate({ _id: id }, lieu, {new: true})
}

let findLieuxByFilters = (nom, ville, type, latMin, latMax, longMin, longMax) => {
    return Lieu.find({
        nom: nom ? { $regex: nom, $options : 'i'} : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true},
        latitude: latMax & latMin ? { $lte: latMax, $gte: latMin } : {$exists: true}, 
        longitude: longMax & longMin ? { $lte: longMax, $gte: longMin } : {$exists: true}
    });
}

module.exports = {
    createLieu,
    findAllLieux,
    findLieuById,
    findByIdAndUpdate,
    findLieuxByFilters
}