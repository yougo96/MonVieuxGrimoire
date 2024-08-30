const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express();

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes.js');

mongoose.connect('mongodb+srv://admin:admin@clustermvg.92nqh.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use((req, res, next) => {
  console.log('Requête reçue : ', req.url);
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;