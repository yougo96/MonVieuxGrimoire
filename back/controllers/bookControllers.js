
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
    Book.find().sort('-averageRating').limit(3)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.postOneBook = (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    if (req.file === undefined) {
        return
    }

    const imageName = `sharped-${Date.now()}-${req.file.originalname}.webp`

    const bookNew = new Book({
        ...bookObject,
        userId: req.auth.userId,
        // ratings: [].req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/static/images/${imageName}`
    })

    sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);

    bookNew.save()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.postOneAverageRating = async (req, res, next) => {
    
    let averageRatingNew = 5

    await Book.findOne({ _id: req.params.id })
    .then(book => {
        const allRating = book.ratings.map(rating => rating.grade)
        averageRatingNew = allRating.reduce((a, b) => a + b) / allRating.length
        averageRatingNew = Math.round(averageRatingNew*10)/10
    })
    .catch(error => res.status(400).json({ error }));

    Book.findOneAndUpdate({ _id: req.params.id}, {averageRating: averageRatingNew})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.postOneBookRating = (req, res, next) => {

    const bookNewRating = {
        $push : {ratings: {
                userId: req.auth.userId,
                grade: req.body.rating
        }}
    }
    delete bookNewRating._id;

    Book.findOneAndUpdate({ _id: req.params.id}, bookNewRating)
    .then(book => 
        {
            fetch(`${req.protocol}://${req.get('host')}/api/books/${req.params.id}/averagerating`)
            res.status(200).json(book)
        }
    )
    .catch(error => res.status(400).json({ error }));
}

exports.putOneBook = (req, res, next) => {
    
    console.log(req.body)

    let bookNew = {}

    if (req.file) {
        const imageName = `sharped-${Date.now()}-${req.file.originalname}.webp`
        bookNew =     {
            ...JSON.parse(req.body.book),
            _id: req.params.id,
            imageUrl: `${req.protocol}://${req.get('host')}/static/images/${imageName}`
        }
        sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);
        // fs.unlinkSync(`static/images/${req.body.imageUrl}`);
    } else {
        bookNew = {
            ...req.body,
            _id: req.params.id,
        }
    }
    
    delete bookNew._userId;

    console.log(bookNew)
    
    Book.findOneAndUpdate({ _id: req.params.id}, bookNew)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneBook = (req, res, next) => {
    Book.findOneAndDelete({ _id: req.params.id})
    .then(book => 
        {
            // fs.unlinkSync(`static/images/${book.imageUrl}`)
            res.status(200).json(book)
        }
    )
    .catch(error => res.status(400).json({ error }));
}