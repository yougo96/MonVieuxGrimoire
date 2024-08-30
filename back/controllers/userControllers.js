
const User = require('../models/user');

exports.getAllUser = (req, res) => {

    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));

};

exports.postLogin = (req, res) => {

    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur inconnu' });
        }
        if (user.password !== req.body.password) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }
        res.status(200).json({
            userId: user._id,
            token: 'TOKEN'
        })
        console.log(user)
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