const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'you must add project name'],
    },
    picture: {
        type: String,
        required: [true, 'you must add a picture'],
    },
    category: {
        type: String,
        required: [true, 'you must add category']
    }
});


module.exports = mongoose.model('Project', projectSchema);