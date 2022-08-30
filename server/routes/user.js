const router = require('express').Router();

const {
  getUser,
  editPass,
  deleteUser
} = require('../controllers/user')

router.get('/getUser', getUser);
router.post('/editPass', editPass);
router.delete('/delete', deleteUser);

module.exports = router;