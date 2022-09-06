const fs = require('fs');
const util = require('util');
const path = require('path');
const { villes } = require('../models/villes');
const {
    createLogement,
    findByIdAndUpdate,
    getLogementByAnnonceur,
    deleteOne,
    getLogementById,
    getLogementsByVilleRecentToOld
} = require('../queries/logement.queries');

const {
    newLogement,
    editLogement
} = require('../models/logement.model');

exports.create = async (req, res) => {
    const logement = newLogement(req, res);
    const l = await createLogement(logement);
    res.status(200).json(l);
}

exports.getByAnnonceur = async (req, res) => {
    const logements = await getLogementByAnnonceur(req.query.annonceur);
    res.status(200).json(logements);
}

exports.getRecentLogement = async (req, res) => {
    let logements = [];
    for(let ville of villes){
        const l = await getLogementsByVilleRecentToOld(ville);
        if(l.length > 0){
            logements.push(l[0]);
        }
    }
    res.status(200).json(logements);
}

exports.getRecentLogementForVille = async (req, res) => {
    const l = await getLogementsByVilleRecentToOld(req.query.ville);
    if(l.length > 0){
        res.status(200).json(l[0]);
    }else{
        res.status(200).json(null);
    }
}

exports.deleteLogement = async (req, res) => {
    const logementDeleted = await deleteOne(req.query.logementId);
    res.status(200).json(logementDeleted);
}

exports.updateLogement = async (req, res) => {
    const logement = editLogement(req, res);
    const logementUpdated = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(logementUpdated);
}

exports.deleteImage = async (req, res) => {
    const logement = await getLogementById(req.query.logementId);
    deleteImage(logement.images[parseInt(req.query.indexImage)]);
    logement.images.splice(parseInt(req.query.indexImage), 1);
    const updatedLogement = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(updatedLogement);
}

exports.uploadImages = async (req, res) => {
    util.inspect(req.files, { compact: false, depth: 5, breakLength: 80, color: true });
    const logement = await getLogementById(req.query.logementId);
    if(logement.images === null){
        logement.images = [];
    }
    if(req.files.image1){
        if(logement.images && logement.images[0]){
            deleteImage(logement.images[0]);
        }
        logement.images[0] = req.files.image1[0].filename;
    }
    if(req.files.image2){
        if(logement.images && logement.images[1]){
            deleteImage(logement.images[1]);
        }
        logement.images[1] = req.files.image2[0].filename;
    }
    if(req.files.image3){
        if(logement.images && logement.images[2]){
            deleteImage(logement.images[2]);
        }
        logement.images[2] = req.files.image3[0].filename;
    }
    if(req.files.image4){
        if(logement.images && logement.images[3]){
            deleteImage(logement.images[3]);
        }
        logement.images[3] = req.files.image4[0].filename
    }
    if(req.files.image5){
        if(logement.images && logement.images[4]){
            deleteImage(logement.images[4]);
        }
        logement.images[4] = req.files.image5[0].filename;
    }
    if(req.files.image6){
        if(logement.images && logement.images[5]){
            deleteImage(logement.images[5]);
        }
        logement.images[5] = req.files.image6[0].filename;
    }
    if(req.files.image7){
        if(logement.images && logement.images[6]){
            deleteImage(logement.images[6]);
        }
        logement.images[6] = req.files.image7[0].filename;
    }
    if(req.files.image8){
        if(logement.images && logement.images[7]){
            deleteImage(logement.images[7]);
        }
        logement.images[7] = req.files.image8[0].filename;
    }
    if(req.files.image9){
        if(logement.images && logement.images[8]){
            deleteImage(logement.images[8]);
        }
        logement.images[8] = req.files.image9[0].filename;
    }
    if(req.files.image10){
        if(logement.images && logement.images[9]){
            deleteImage(logement.images[9]);
        }
        logement.images[9] = req.files.image10[0].filename;
    }
    if(req.files.image11){
        if(logement.images && logement.images[10]){
            deleteImage(logement.images[10]);
        }
        logement.images[10] = req.files.image11[0].filename;
    }
    if(req.files.image12){
        if(logement.images && logement.images[11]){
            deleteImage(logement.images[11]);
        }
        logement.images[11] = req.files.image12[0].filename;
    }
    if(req.files.image13){
        if(logement.images && logement.images[12]){
            deleteImage(logement.images[12]);
        }
        logement.images[12] = req.files.image13[0].filename;
    }
    const updatedLogement = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(updatedLogement);
}

deleteImage = (imageToRemove) => {
    fs.unlink(path.join(__dirname, `../upload/${imageToRemove}`), err => {
        if (err) throw err;
    });
}