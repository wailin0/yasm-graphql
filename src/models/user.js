const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required:true
    },
    photoURL: {
        type: String,
        default: 'https://source.unsplash.com/random'
    },
    coverPhotoURL: {
        type: String,
        default: 'https://source.unsplash.com/random'
    }
})

module.exports = mongoose.model('User', schema)
