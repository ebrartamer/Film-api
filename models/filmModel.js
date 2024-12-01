const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            rating: { type: Number, min: 1, max: 10, required: true }
        }
    ],
    averageRating: { type: Number, default: 0 }, // Ortalama puan
    poster: {
        type: String,  // Görsel dosyasının yolu
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model('Film', filmSchema);
