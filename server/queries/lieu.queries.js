const Lieu = require('../models/lieu.model');

exports.createLieu = (lieu, res) => {
    return lieu.save();
}

exports.getAllLieux = () => {
    return Lieu.find({}).exec();
}

exports.getLieuById = (lieuId) => {
    return Lieu.findById(lieuId).exec();
}

exports.findByIdAndUpdate = (id, lieu) => {
    return Lieu.findByIdAndUpdate({ _id: id }, lieu, {new: true})
}

exports.getLieuxByFilters = (nom, ville, type) => {
    return Lieu.find({
        nom: nom ? nom : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true}
    });
}