const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/bookControllers');

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', bookCtrl.getAllBook);
router.get('/bestrating', bookCtrl.getBestBook);
router.get('/:id', bookCtrl.getOneBook);

router.post('/', auth, multer, bookCtrl.postOneBook);
router.post('/:id/rating', auth, bookCtrl.postOneBookRating);

router.put('/:id', auth, multer, bookCtrl.putOneBook)

router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;