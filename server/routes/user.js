const router = require('express').Router();

const {
  getUserByLastName,
  editPass,
  deleteUser,
  resetPass,
  getUserByMail
} = require('../controllers/user');

router.get('/getUserByLastName', getUserByLastName);
router.get('/getUserByMail', getUserByMail);
router.post('/editPass', editPass);
router.post('/resetPass', resetPass);
router.delete('/delete', deleteUser);

module.exports = router;