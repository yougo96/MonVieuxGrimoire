
const { json } = require('express');
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

    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const bookNew = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/${req.file.filename}`
    })

    console.log(bookNew)

    bookNew.save()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

// exports.putOneBook = (req, res, next) => {
//     book.save()
//     .then(book => res.status(200).json(book))
//     .catch(error => res.status(400).json({ error }));
// }

// exports.deleteOneBook = (req, res, next) => {
//     book.removeOne(req.params.id)
//     .then(book => res.status(200).json(book))
//     .catch(error => res.status(400).json({ error }));
// }