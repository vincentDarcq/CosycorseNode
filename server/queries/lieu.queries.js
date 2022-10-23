const Lieu = require('../models/lieu.model');

exports.createLieu = (lieu, res) => {
    return lieu.save();
}

exports.getAllLieu = () => {
    return Lieu.find({}).exec();
}

exports.getLieuById = (lieuId) => {
    return Lieu.findById(lieuId).exec();
}

exports.findByIdAndUpdate = (id, lieu) => {
    return Lieu.findByIdAndUpdate({ _id: id }, lieu, {new: true})
}