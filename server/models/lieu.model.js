const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lieuSchema = Schema({
    nom: String,
    ville: String,
    type: String,
    description: String,
    latitude: Number,
    longitude: Number,
    annonceur: String,
    images: [String]
});

lieuSchema.set('timestamps', true);

const Lieu = mongoose.model('lieu', lieuSchema);

module.exports = Lieu;

module.exports.newLieu = function (req) {
    const newLieu = new Lieu({
        nom: req.body.nom,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        annonceur: req.body.annonceur,
        images: null
    });
    return newLieu;
}

module.exports.editLieu = function (req) {
    const editLieu = {
        nom: req.body.nom,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        annonceur: req.body.annonceur,
        images: req.body.images
    };
    return editLieu;
}