const util = require('util');
const {
    createLieu,
    findLieuById,
    findByIdAndUpdate,
    findAllLieux,
    findLieuxByFilters
} = require('../queries/lieu.queries');
const { deleteImage } = require('../utils/images');

let create = async (req, res) => {
    const l = await createLieu(req);
    res.status(200).json(l);
}

let updateLieu = async (req, res) => {
    const lieuUpdated = await findByIdAndUpdate(req.query.lieuId, req.body);
    res.status(200).json(lieuUpdated);
}

let getById = async (req, res) => {
    const lieu = await findLieuById(req.query.lieuId);
    res.status(200).json(lieu);
}

let getAll = async (req, res) => {
    const lieux = await findAllLieux();
    res.status(200).json(lieux);
}

let findByFilters = async (req, res) => {
    req.query.nom = req.query.nom === 'undefined' ? null : req.query.nom;
    req.query.ville = req.query.ville === 'undefined' ? null : req.query.ville;
    req.query.type = req.query.type === 'undefined' ? null : req.query.type;
    const lieux = await findLieuxByFilters(
        req.query.nom, 
        req.query.ville, 
        req.query.type,
        req.query.latMin, 
        req.query.latMax, 
        req.query.longMin, 
        req.query.longMax
    );
    res.status(200).json(lieux);
}

let uploadImages = async (req, res) => {
    util.inspect(req.files, { compact: false, depth: 5, breakLength: 80, color: true });
    const lieu = await findLieuById(req.query.lieuId);
    if (lieu.images === null) {
        lieu.images = [];
    }
    if (req.files.image1) {
        if (lieu.images && lieu.images[0]) {
            deleteImage(lieu.images[0]);
        }
        lieu.images[0] = req.files.image1[0].filename;
    }
    if (req.files.image2) {
        if (lieu.images && lieu.images[1]) {
            deleteImage(lieu.images[1]);
        }
        lieu.images[1] = req.files.image2[0].filename;
    }
    if (req.files.image3) {
        if (lieu.images && lieu.images[2]) {
            deleteImage(lieu.images[2]);
        }
        lieu.images[2] = req.files.image3[0].filename;
    }
    if (req.files.image4) {
        if (lieu.images && lieu.images[3]) {
            deleteImage(lieu.images[3]);
        }
        lieu.images[3] = req.files.image4[0].filename
    }
    if (req.files.image5) {
        if (lieu.images && lieu.images[4]) {
            deleteImage(lieu.images[4]);
        }
        lieu.images[4] = req.files.image5[0].filename;
    }
    if (req.files.image6) {
        if (lieu.images && lieu.images[5]) {
            deleteImage(lieu.images[5]);
        }
        lieu.images[5] = req.files.image6[0].filename;
    }
    if (req.files.image7) {
        if (lieu.images && lieu.images[6]) {
            deleteImage(lieu.images[6]);
        }
        lieu.images[6] = req.files.image7[0].filename;
    }
    if (req.files.image8) {
        if (lieu.images && lieu.images[7]) {
            deleteImage(lieu.images[7]);
        }
        lieu.images[7] = req.files.image8[0].filename;
    }
    if (req.files.image9) {
        if (lieu.images && lieu.images[8]) {
            deleteImage(lieu.images[8]);
        }
        lieu.images[8] = req.files.image9[0].filename;
    }
    if (req.files.image10) {
        if (lieu.images && lieu.images[9]) {
            deleteImage(lieu.images[9]);
        }
        lieu.images[9] = req.files.image10[0].filename;
    }
    if (req.files.image11) {
        if (lieu.images && lieu.images[10]) {
            deleteImage(lieu.images[10]);
        }
        lieu.images[10] = req.files.image11[0].filename;
    }
    if (req.files.image12) {
        if (lieu.images && lieu.images[11]) {
            deleteImage(lieu.images[11]);
        }
        lieu.images[11] = req.files.image12[0].filename;
    }
    if (req.files.image13) {
        if (lieu.images && lieu.images[12]) {
            deleteImage(lieu.images[12]);
        }
        lieu.images[12] = req.files.image13[0].filename;
    }
    const updatedLieu = await findByIdAndUpdate(req.query.lieuId, lieu);
    res.status(200).json(updatedLieu);
}

let deletionImageFromFront = async (req, res) => {
    const lieu = await findLieuById(req.query.lieuId);
    deleteImage(lieu.images[parseInt(req.query.indexImage)]);
    lieu.images.splice(parseInt(req.query.indexImage), 1);
    const updatedLieu = await findByIdAndUpdate(req.query.logementId, logement);
    res.status(200).json(updatedLieu);
}

module.exports = {
    create,
    updateLieu,
    getAll,
    findByFilters,
    uploadImages,
    getById,
    deletionImageFromFront
}