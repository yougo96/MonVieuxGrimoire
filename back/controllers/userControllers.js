
const { Router } = require('express');
const app = Router();

const User = require('../models/user');

app.post('/auth/signup ', (req, res) => {
    console.log('signup');
});

app.post('/auth/login ', (req, res) => {
    console.log('login');
});

module.exports = app;