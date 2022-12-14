const router = require('express').Router();

const {
  signin,
  refresh_token,
  signup,
  isLoggedIn,
  authentWithToken,
  generateTokenForCreateReservation
} = require('../controllers/authentication')

router.get('/refresh-token', refresh_token);
router.get('/current', isLoggedIn);
router.post('/signin', signin);
router.post('/signup', signup);
router.get('/authent-withToken', authentWithToken);
router.get('/generated-token', generateTokenForCreateReservation);

module.exports = router;