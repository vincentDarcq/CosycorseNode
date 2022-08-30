const router = require('express').Router();

const {
  signin,
  refresh_token,
  signup,
  isLoggedIn
} = require('../controllers/authentication')

router.get('/refresh-token', refresh_token);
router.get('/current', isLoggedIn);
router.post('/signin', signin);
router.post('/signup', signup);

module.exports = router;