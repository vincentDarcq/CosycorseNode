const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logementSchema = Schema({
    adresse: String,
    ville: String,
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
    images: [String],
    fumeur: Boolean,
    animaux: Boolean,
    access_handicap: Boolean
});

logementSchema.set('timestamps', true);

const Logement = mongoose.model('logement', logementSchema);

module.exports = Logement;

module.exports.newLogement = function (req) {
    const newLogement = new Logement({
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
        images: null
    });
    return newLogement;
}

module.exports.editLogement = function (req) {
    const editLogement = {
        adresse: req.body.addresse,
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
        images: req.body.images
    };
    return editLogement;
}