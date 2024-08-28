const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://admin:admin@clustermvg.92nqh.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  console.log('Requête reçue !', req.url);
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h1>Test</h1>'));
});

module.exports = app;