const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/bookControllers');

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
// router.get('/bestrating', bookCtrl.getOneBookBestRating);

router.post('/', auth, multer, bookCtrl.postOneBook);
// router.post('/:id/rating', bookCtrl.postOneBookRating);

// router.put('/:id', bookCtrl.putOneBook)

// router.delete('/:id', bookCtrl.deleteOneBook);

module.exports = router;