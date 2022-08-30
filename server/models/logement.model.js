const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logementSchema = Schema({
    addresse: String,
    description: String,
    logement: String,
    voyageurs: Number,
    lits: Number,
    sdbs: Number,
    latitude: Number,
    longitude: Number,
    annonceur: String,
    prix: Number,
    equipements: [String],
    images: [String]
});

const Logement = mongoose.model('logement', logementSchema);

module.exports = Logement;

module.exports.newLogement = function (req) {
    const newLogement = new Logement({
        addresse: req.body.addresse,
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
        images: null
    });
    return newLogement;
}

module.exports.editLogement = function (req) {
    const editLogement = {
        addresse: req.body.addresse,
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
        images: req.body.images
    };
    return editLogement;
}