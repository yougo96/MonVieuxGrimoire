
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

exports.getBestBook = (req, res, next) => {
    // res.status(200).json("toto")
    
    Book.find()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}


exports.postOneBook = (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const imageName = `sharped-${Date.now()}-${req.file.originalname}.webp`

    const bookNew = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/${imageName}`
    })

    sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);

    bookNew.save()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.putOneBook = (req, res, next) => {

    const imageName = `sharped-${Date.now()}-${req.file.originalname}.webp`
    
    const bookNew = req.file ?
    {
        ...JSON.parse(req.body.book),
        _id: req.params.id,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/${imageName}`
    }
    : 
    {
        ...req.body,
        _id: req.params.id,
    }

    sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);
    
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