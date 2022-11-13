const Lieu = require('../models/lieu.model');

let createLieu = (lieu) => {
    return lieu.save();
}

let getAllLieux = () => {
    return Lieu.find({}).exec();
}

let getLieuById = (lieuId) => {
    return Lieu.findById(lieuId).exec();
}

let findByIdAndUpdate = (id, lieu) => {
    return Lieu.findByIdAndUpdate({ _id: id }, lieu, {new: true})
}

let getLieuxByFilters = (nom, ville, type) => {
    return Lieu.find({
        nom: nom ? nom : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true}
    });
}

module.exports = {
    createLieu,
    getAllLieux,
    getLieuById,
    findByIdAndUpdate,
    getLieuxByFilters
}