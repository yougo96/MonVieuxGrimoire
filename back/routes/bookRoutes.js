const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/bookControllers');

router.get('/api/book', bookCtrl.getAllBook);

module.exports = router;