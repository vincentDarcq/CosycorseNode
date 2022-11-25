const Activite = require('../models/activite.model');

let createActivite = (req) => {
    return new Activite({
        titre: req.body.titre,
        proposeur: req.body.proposeur,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        duree: req.body.duree,
        images: null
    }).save();
}

let findAllActivites = () => {
    return Activite.find({}).exec();
}

let findActiviteById = (activiteId) => {
    return Activite.findById(activiteId).exec();
}

let findActiviteByIdAndUpdate = (id, activite) => {
    return Activite.findByIdAndUpdate({ _id: id }, activite, {new: true})
}

let findActivitesByFilters = (titre, ville, type, latMin, latMax, longMin, longMax) => {
    return Activite.find({
        titre: titre ? { $regex: titre, $options : 'i' } : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true},
        latitude: latMax & latMin ? { $lte: latMax, $gte: latMin } : {$exists: true}, 
        longitude: longMax & longMin ? { $lte: longMax, $gte: longMin } : {$exists: true}
    });
}

module.exports = {
    createActivite,
    findAllActivites,
    findActiviteById,
    findActiviteByIdAndUpdate,
    findActivitesByFilters
}