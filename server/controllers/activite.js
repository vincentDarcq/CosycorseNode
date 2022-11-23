const util = require('util');
const { 
    newActivite
} = require("../models/activite.model");
const { 
    createActivite, 
    findActiviteById,
    findActiviteByIdAndUpdate,
    findAllActivites,
    findActivitesByFilters
} = require("../queries/activite.queries");
const { deleteImage } = require('../utils/images');

let create = async (req, res) => {
    const activite = newActivite(req, res);
    const a = await createActivite(activite);
    res.status(200).json(a);
}

let getAll = async (req, res) => {
    const activites = await findAllActivites();
    res.status(200).json(activites);
}

let findByFilters = async (req, res) => {
    req.query.titre = req.query.titre === 'undefined' ? null : req.query.titre;
    req.query.ville = req.query.ville === 'undefined' ? null : req.query.ville;
    req.query.type = req.query.type === 'undefined' ? null : req.query.type;
    const activites = await findActivitesByFilters(
        req.query.titre, 
        req.query.ville, 
        req.query.type);
    res.status(200).json(activites);
}

let uploadImages = async (req, res) => {
    util.inspect(req.files, { compact: false, depth: 5, breakLength: 80, color: true });
    const activite = await findActiviteById(req.query.activiteId);
    if (activite.images === null) {
        activite.images = [];
    }
    if (req.files.image1) {
        if (activite.images && activite.images[0]) {
            deleteImage(activite.images[0]);
        }
        activite.images[0] = req.files.image1[0].filename;
    }
    if (req.files.image2) {
        if (activite.images && activite.images[1]) {
            deleteImage(activite.images[1]);
        }
        activite.images[1] = req.files.image2[0].filename;
    }
    if (req.files.image3) {
        if (activite.images && activite.images[2]) {
            deleteImage(activite.images[2]);
        }
        activite.images[2] = req.files.image3[0].filename;
    }
    if (req.files.image4) {
        if (activite.images && activite.images[3]) {
            deleteImage(activite.images[3]);
        }
        activite.images[3] = req.files.image4[0].filename
    }
    if (req.files.image5) {
        if (activite.images && activite.images[4]) {
            deleteImage(activite.images[4]);
        }
        activite.images[4] = req.files.image5[0].filename;
    }
    if (req.files.image6) {
        if (activite.images && activite.images[5]) {
            deleteImage(activite.images[5]);
        }
        activite.images[5] = req.files.image6[0].filename;
    }
    if (req.files.image7) {
        if (activite.images && activite.images[6]) {
            deleteImage(activite.images[6]);
        }
        activite.images[6] = req.files.image7[0].filename;
    }
    if (req.files.image8) {
        if (activite.images && activite.images[7]) {
            deleteImage(activite.images[7]);
        }
        activite.images[7] = req.files.image8[0].filename;
    }
    if (req.files.image9) {
        if (activite.images && activite.images[8]) {
            deleteImage(activite.images[8]);
        }
        activite.images[8] = req.files.image9[0].filename;
    }
    if (req.files.image10) {
        if (activite.images && activite.images[9]) {
            deleteImage(activite.images[9]);
        }
        activite.images[9] = req.files.image10[0].filename;
    }
    if (req.files.image11) {
        if (activite.images && activite.images[10]) {
            deleteImage(activite.images[10]);
        }
        activite.images[10] = req.files.image11[0].filename;
    }
    if (req.files.image12) {
        if (activite.images && activite.images[11]) {
            deleteImage(activite.images[11]);
        }
        activite.images[11] = req.files.image12[0].filename;
    }
    if (req.files.image13) {
        if (activite.images && activite.images[12]) {
            deleteImage(activite.images[12]);
        }
        activite.images[12] = req.files.image13[0].filename;
    }
    const updatedActivite = await findActiviteByIdAndUpdate(req.query.activiteId, activite);
    res.status(200).json(updatedActivite);
}

module.exports = {
    create,
    uploadImages,
    getAll,
    findByFilters
}