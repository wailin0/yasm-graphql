const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', schema)
