const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userControllers');

router.get('/', userCtrl.getAllUser);

// router.post('/login', userCtrl.postLogin);
// router.post('/signup', userCtrl.postSignup);

module.exports = router;