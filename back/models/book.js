const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String },
    imageUrl: { type: String },
    year: { type: Number },
    genre: { type: String },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number },
        },        
    ],
    averageRating: { type: Number },

});

module.exports = mongoose.model('Book', bookSchema);
