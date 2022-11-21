const storage = require('../upload/multer');
const router = require('express').Router();
const {
    create,
    uploadImages,
    updateLieu,
    getAll,
    findByFilters,
    getById,
    deletionImageFromFront
} = require('../controllers/lieu')

router.post('/create', create);
router.post('/uploadImages', storage.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' },
{ name: 'image4' }, { name: 'image5' }, { name: 'image6' }, { name: 'image7' }, { name: 'image8' },
{ name: 'image9' }, { name: 'image10' }, { name: 'image11' }, { name: 'image13' }]),
    uploadImages);
router.post('/update', updateLieu);
router.get('/getById', getById);
router.get('/getAll', getAll);
router.get('/getByFilters', findByFilters);
router.get('/deleteImage', deletionImageFromFront);

module.exports = router;