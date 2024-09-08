const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { 
        type: String, 
        required: true
    },
    title: { 
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    author: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    year: { type: Number },
    genre: { type: String, trim: true },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number },
        },        
    ],
    averageRating: { type: Number },

});

module.exports = mongoose.model('Book', bookSchema);
