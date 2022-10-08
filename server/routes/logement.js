const storage = require('../upload/multer');
const router = require('express').Router();
const {
    create,
    uploadImages,
    getByAnnonceur,
    deleteLogement,
    deleteImage,
    updateLogement,
    getRecentLogement,
    getLogementById,
    getRecentLogementForVille,
    getByFiltres
} = require('../controllers/logement')

router.post('/create', create);
router.post('/uploadImages', storage.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' },
{ name: 'image4' }, { name: 'image5' }, { name: 'image6' }, { name: 'image7' }, { name: 'image8' },
{ name: 'image9' }, { name: 'image10' }, { name: 'image11' }, { name: 'image13' }]),
    uploadImages)
router.get('/getByAnnonceur', getByAnnonceur);
router.get('/getRandom', getRecentLogement);
router.get('/getByFiltres', getByFiltres);
router.get('/getLogementById', getLogementById);
router.get('/getRandomForVille', getRecentLogementForVille);
router.get('/delete', deleteLogement);
router.post('/update', updateLogement);
router.get('/deleteImage', deleteImage);

module.exports = router;