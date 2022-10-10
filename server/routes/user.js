const router = require('express').Router();

const {
  getUser,
  editPass,
  deleteUser,
  resetPass
} = require('../controllers/user')

router.get('/getUser', getUser);
router.post('/editPass', editPass);
router.post('/resetPass', resetPass);
router.delete('/delete', deleteUser);

module.exports = router;