
const { json } = require('express');
const Book = require('../models/book.js');
const sharp = require('sharp');
const fs = require('fs');
const { resolve } = require('path');

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

    try {
        if (!fs.existsSync("static/images")){
            fs.mkdirSync("static/images");
        }
        sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de charger l\'image' })
    }

    bookNew.save()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.postOneAverageRating = (id, ar) => {
    Book.findOneAndUpdate({ _id: id}, {averageRating: ar}, {new: true})
    .then(book => console.log("average rating : ", book.averageRating))
    .catch(error => console.log(error));
}

exports.postOneBookRating = (req, res, next) => {

    const bookNewRating = {
        $push : {ratings: {
                userId: req.auth.userId,
                grade: req.body.rating
        }}
    }
    delete bookNewRating._id;

    Book.findOneAndUpdate({ _id: req.params.id}, bookNewRating, {new: true})
    .then(book => 
        {
            const allRating = book.ratings.map(rating => rating.grade)
            let averageRatingNew = allRating.reduce((a, b) => a + b) / allRating.length
            averageRatingNew = Math.round(averageRatingNew*10)/10
            book.averageRating = averageRatingNew
            
            this.postOneAverageRating(req.params.id, averageRatingNew);
            
            // fetch(`${req.protocol}://${req.get('host')}/api/books/${req.params.id}/averagerating`)
            console.log("rating added")
            res.status(200).json(book)
        }
    )
    .catch(error => res.status(400).json({ error }))
}

exports.putOneBook = (req, res, next) => {
    
    console.log(req.file)

    let bookNew = {}

    if (req.file) {

        Book.findOne({ _id: req.params.id })
        .then(book => deleteFile(book.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, "")))
        .catch(error => res.status(400).json({ error }));

        const imageName = `sharped-${Date.now()}-${req.file.originalname}.webp`
        bookNew =     {
            ...JSON.parse(req.body.book),
            _id: req.params.id,
            imageUrl: `${req.protocol}://${req.get('host')}/static/images/${imageName}`
        }
        sharp(req.file.buffer).resize({ height: 1024 }).webp({ quality: 60 }).toFile(`static/images/${imageName}`);
        
    } else {
        bookNew = {
            ...req.body,
            _id: req.params.id,
        }
    }
    
    delete bookNew._userId;

    console.log(bookNew)
    
    Book.findOneAndUpdate({ _id: req.params.id}, bookNew, {new: true})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneBook = (req, res, next) => {
    Book.findOneAndDelete({ _id: req.params.id})
    .then(book => 
        {
            deleteFile(book.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ""))
            res.status(200).json(book)
        }
    )
    .catch(error => res.status(400).json({ error }));
}

function deleteFile(path) {
    try {
        fs.unlinkSync(path, function (err) {
            if (err) throw err;
            resolve("File deleted!");
        });
    } catch (error) {
        console.log(error);
    }
}