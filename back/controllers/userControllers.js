
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUser = (req, res) => {

    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));

};

exports.postLogin = (req, res) => {

    console.log(req.body);

    User.findOne({ email: req.body.email })
    .then(user => {

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur inconnu' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

exports.postSignup = (req, res) => {
    console.log('SignUp');

    bcrypt.hash(req.body.password, 10)
    .then(hash => {

        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
        .catch(error => res.status(error.status).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));


};