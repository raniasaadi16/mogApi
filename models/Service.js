const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'you must add service name'],
    },
    picture: {
        type: String,
        required: [true, 'you must add a picture'],
    },
    color: {
        type: String,
        required: [true, 'you must add color']
    },
    icon: {
        type: String,
        required: [true, 'you must add icon']
    },
    description: {
        type: String,
        required: [true, 'you must add description']
    }
});


module.exports = mongoose.model('Service', serviceSchema);