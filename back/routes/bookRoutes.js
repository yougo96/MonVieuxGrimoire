const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/bookControllers');

const auth = require('../middlewares/auth');

router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
// router.get('/bestrating', bookCtrl.getOneBookBestRating);

// router.post('/', bookCtrl.postOneBook);
// router.post('/:id/rating', bookCtrl.postOneBookRating);

// router.put('/:id', bookCtrl.putOneBook)

// router.delete('/:id', bookCtrl.deleteOneBook);

module.exports = router;