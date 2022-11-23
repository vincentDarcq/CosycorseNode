const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activiteSchema = Schema({
    titre: String,
    proposeur: String,
    type: String,
    duree: String,
    description: String,
    ville: String,
    latitude: Number,
    longitude: Number,
    annonceur: String,
    images: [String]
});

activiteSchema.set('timestamps', true);

const Activite = mongoose.model('activite', activiteSchema);

module.exports = Activite;

module.exports.newActivite = function (req) {
    const newActivite = new Activite({
        titre: req.body.titre,
        proposeur: req.body.proposeur,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        duree: req.body.duree,
        images: null
    });
    return newActivite;
}

module.exports.editActivite = function (req) {
    const editActivite = {
        titre: req.body.titre,
        proposeur: req.body.proposeur,
        ville: req.body.ville,
        type: req.body.type,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        duree: req.body.duree,
        images: req.body.images
    };
    return editActivite;
}