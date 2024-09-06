const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

require('dotenv').config()
const {DB_URL} = process.env

const app = express();

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes.js');

mongoose.connect(DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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