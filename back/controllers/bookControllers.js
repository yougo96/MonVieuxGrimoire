
const { json } = require('express');
const Book = require('../models/book.js');
const sharp = require('sharp');
const fs = require('fs');

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

exports.postOneBook = async (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    console.log(req.file)

    const bookNew = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/sharped-${req.file.filename}.png`
    })

    await sharp(req.file.path).resize({ height: 1024 }).png({ quality: 60 }).toFile(`static/images/sharped-${req.file.filename}.png`);
    fs.unlinkSync(req.file.path);

    console.log(bookNew)

    bookNew.save()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.putOneBook = (req, res, next) => {
    
    const bookNew = req.file ? 
    {
        ...JSON.parse(req.body.book),
        _id: req.params.id,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/${req.file.filename}.png`
    }
    : 
    {
        ...req.body,
        _id: req.params.id,
    }
    
    delete bookNew._userId;

    console.log(bookNew)
    
    Book.findOneAndUpdate({ _id: req.params.id}, bookNew)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneBook = (req, res, next) => {
    Book.findOneAndDelete({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}