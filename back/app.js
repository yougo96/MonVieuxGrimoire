const express = require('express');

const app = express();

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