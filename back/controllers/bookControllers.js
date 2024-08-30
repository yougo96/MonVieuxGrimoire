
const book = require('../models/book.js');
const Book = require('../models/book.js');

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.postOneBook = (req, res, next) => {
    Book.create()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.putOneBook = (req, res, next) => {
    Book.create()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneBook = (req, res, next) => {
    Book.create()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}