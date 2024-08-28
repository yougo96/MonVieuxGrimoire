
const Book = require('../models/book.js');

exports.getAllBook = (req, res, next) => {
    console.log('book1');
    Book.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}