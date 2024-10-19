// Node/Express
const express = require('express');
const bodyParser = require('body-parser')
// DB
const mongoose = require('mongoose');
// Security
require('dotenv').config()
const {DB_URL} = process.env
const helmet = require("helmet");
var filter = require('content-filter')
// App
const app = express();

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes.js');

// -------------------------------------------------

// Mongoose
mongoose.connect(DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
mongoose.set('sanitizeFilter', true);

// app.setup
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.security
app.use((req, res, next) => {
  helmet({crossOriginResourcePolicy:false})
  next();
});

var blackList = ['$','{','&&','||']
var options = {
    urlBlackList: blackList,
    bodyBlackList: blackList
}
app.use((req, res, next) => {
  filter(options);
  next();
});

app.use((req, res, next) => {
  res.setHeader('origin', 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.middleware
app.use((req, res, next) => {
  console.log('Requête reçue : ', req.url);
  res.status(201);
  next();
});

// app.Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;