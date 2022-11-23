const Lieu = require('../models/lieu.model');

let createLieu = (lieu) => {
    return lieu.save();
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

let findLieuxByFilters = (nom, ville, type) => {
    return Lieu.find({
        nom: nom ? { $regex: nom, $options : 'i'} : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true}
    });
}

module.exports = {
    createLieu,
    findAllLieux,
    findLieuById,
    findByIdAndUpdate,
    findLieuxByFilters
}