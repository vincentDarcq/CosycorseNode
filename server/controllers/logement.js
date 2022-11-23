const util = require('util');
const { villes } = require('../models/villes');
const {
    createLogement,
    findByIdAndUpdate,
    deleteOne,
    getLogementById,
    getLogementsByVilleRecentToOld,
    getLogementsByFiltres,
    getLogementByEmailAnnonceur
} = require('../queries/logement.queries');

const { adresse_not_in_corse } = require('../utils/reponses');
const { findReservationsBylogementId } = require('../queries/logement_reservation.queries');
const { getDateFromStringDate } = require('../utils/dates');
const { deleteImage } = require('../utils/images');

let create = async (req, res) => {
    if((req.body.longitude < 7.975044250488282 || req.body.longitude > 9.644966125488283)
      && (req.body.latitude < 41.35774173825274 || req.body.latitude > 43.06637963617605)){
        res.status(400).json(adresse_not_in_corse);
    }else {
        const l = await createLogement(req);
        res.status(200).json(l);
    }
}

let getByAnnonceur = async (req, res) => {
    const logements = await getLogementByEmailAnnonceur(req.query.emailAnnonceur);
    res.status(200).json(logements);
}

let getRecentLogement = async (req, res) => {
    let logements = [];
    for (let ville of villes) {
        const l = await getLogementsByVilleRecentToOld(ville);
        if (l.length > 0) {
            logements.push(l[0]);
        }
    }
    res.status(200).json(logements);
}

let getByFiltres = async (req, res) => {
    let dd, df;
    if(req.query.dateDebut.length > 0){
        dd = new Date(req.query.dateDebut);
        dd.setHours(dd.getHours()+1);
    }
    if(req.query.dateFin.length > 0){
        df = new Date(req.query.dateFin);
        df.setHours(df.getHours()+1);
    }
    req.query.ville = req.query.ville === 'undefined' ? null : req.query.ville;
    req.query.voyageurs = req.query.voyageurs === 'undefined' ? null : req.query.voyageurs;
    req.query.lits = req.query.lits === 'undefined' ? null : req.query.lits;
    req.query.sdbs = req.query.sdbs === 'undefined' ? null : req.query.sdbs;
    req.query.prix = req.query.prix === 'undefined' ? null : req.query.prix;
    req.query.latMin = req.query.latMin === 'undefined' ? null : req.query.latMin;
    req.query.latMax = req.query.latMax === 'undefined' ? null : req.query.latMax;
    req.query.longMin = req.query.longMin === 'undefined' ? null : req.query.longMin;
    req.query.longMax = req.query.longMax === 'undefined' ? null : req.query.longMax;
    const logements = await getLogementsByFiltres(
        req.query.ville, 
        req.query.voyageurs, 
        req.query.lits, 
        req.query.sdbs, 
        req.query.prix,
        req.query.equipements,
        req.query.latMin, 
        req.query.latMax, 
        req.query.longMin, 
        req.query.longMax
    );
    if(dd && df){
        let indexes = [];
        for(let i = 0; i < logements.length; i++){
            const lrs = await findReservationsBylogementId(logements[i]._id.toHexString());
            lrs.forEach(lr => {
                const db = getDateFromStringDate(lr.dateDebut);
                const de = getDateFromStringDate(lr.dateFin);
                if((dd.getTime() > db.getTime() && dd.getTime() < de.getTime())
                    || (df.getTime() > db.getTime() && df.getTime() < de.getTime())){
                    indexes.push(i);
                }
            })
        }
        indexes.forEach(i => {
            logements.splice(i, 1);
        })
    }
    res.status(200).json(logements);
}

let findLogementById = async (req, res) => {
    const l = await getLogementById(req.query.logementId);
    res.status(200).json(l);
}

let getRecentLogementForVille = async (req, res) => {
    const l = await getLogementsByVilleRecentToOld(req.query.ville);
    if (l.length > 0) {
        res.status(200).json(l[0]);
    } else {
        res.status(200).json(null);
    }
}

let deleteLogement = async (req, res) => {
    const logementDeleted = await deleteOne(req.query.logementId);
    res.status(200).json(logementDeleted);
}

let updateLogement = async (req, res) => {
    const logementUpdated = await findByIdAndUpdate(req.query.logementId, req.body);
    res.status(200).json(logementUpdated);
}

let cacherAnnonce = async (req, res) => {
    const logement = await getLogementById(req.query.logementId);
    logement.exposer = false;
    const logementUpdated = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(logementUpdated);
}

let exposerAnnonce = async (req, res) => {
    const logement = await getLogementById(req.query.logementId);
    logement.exposer = true;
    const logementUpdated = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(logementUpdated);
}

let deletionImageFromFront = async (req, res) => {
    const logement = await getLogementById(req.query.logementId);
    deleteImage(logement.images[parseInt(req.query.indexImage)]);
    logement.images.splice(parseInt(req.query.indexImage), 1);
    const updatedLogement = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(updatedLogement);
}

let uploadImages = async (req, res) => {
    util.inspect(req.files, { compact: false, depth: 5, breakLength: 80, color: true });
    const logement = await getLogementById(req.query.logementId);
    if (logement.images === null) {
        logement.images = [];
    }
    if (req.files.image1) {
        if (logement.images && logement.images[0]) {
            deleteImage(logement.images[0]);
        }
        logement.images[0] = req.files.image1[0].filename;
    }
    if (req.files.image2) {
        if (logement.images && logement.images[1]) {
            deleteImage(logement.images[1]);
        }
        logement.images[1] = req.files.image2[0].filename;
    }
    if (req.files.image3) {
        if (logement.images && logement.images[2]) {
            deleteImage(logement.images[2]);
        }
        logement.images[2] = req.files.image3[0].filename;
    }
    if (req.files.image4) {
        if (logement.images && logement.images[3]) {
            deleteImage(logement.images[3]);
        }
        logement.images[3] = req.files.image4[0].filename
    }
    if (req.files.image5) {
        if (logement.images && logement.images[4]) {
            deleteImage(logement.images[4]);
        }
        logement.images[4] = req.files.image5[0].filename;
    }
    if (req.files.image6) {
        if (logement.images && logement.images[5]) {
            deleteImage(logement.images[5]);
        }
        logement.images[5] = req.files.image6[0].filename;
    }
    if (req.files.image7) {
        if (logement.images && logement.images[6]) {
            deleteImage(logement.images[6]);
        }
        logement.images[6] = req.files.image7[0].filename;
    }
    if (req.files.image8) {
        if (logement.images && logement.images[7]) {
            deleteImage(logement.images[7]);
        }
        logement.images[7] = req.files.image8[0].filename;
    }
    if (req.files.image9) {
        if (logement.images && logement.images[8]) {
            deleteImage(logement.images[8]);
        }
        logement.images[8] = req.files.image9[0].filename;
    }
    if (req.files.image10) {
        if (logement.images && logement.images[9]) {
            deleteImage(logement.images[9]);
        }
        logement.images[9] = req.files.image10[0].filename;
    }
    if (req.files.image11) {
        if (logement.images && logement.images[10]) {
            deleteImage(logement.images[10]);
        }
        logement.images[10] = req.files.image11[0].filename;
    }
    if (req.files.image12) {
        if (logement.images && logement.images[11]) {
            deleteImage(logement.images[11]);
        }
        logement.images[11] = req.files.image12[0].filename;
    }
    if (req.files.image13) {
        if (logement.images && logement.images[12]) {
            deleteImage(logement.images[12]);
        }
        logement.images[12] = req.files.image13[0].filename;
    }
    const updatedLogement = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(updatedLogement);
}

module.exports = { 
    create, 
    getByAnnonceur, 
    getRecentLogement, 
    getByFiltres, 
    findLogementById,
    getRecentLogementForVille,
    deleteLogement,
    updateLogement,
    deletionImageFromFront,
    uploadImages,
    cacherAnnonce,
    exposerAnnonce
}