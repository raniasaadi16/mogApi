const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'you must add content'],
    },
    picture: {
        type: String,
        required: [true, 'you must add a picture'],
    },
    name: {
        type: String,
        required: [true, 'you must add name']
    }
});


module.exports = mongoose.model('Review', reviewSchema);