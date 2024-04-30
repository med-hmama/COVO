const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    carModel: { 
        type: String, 
        required: true 
    },

    carPicture: String,

    startingLocation: { 
        type: String, 
        required: true 
    },

    destination: { 
        type: String, 
        required: true 
    },

    price: { 
        type: Number, 
        required: true 
    },

    dateTime: { 
        type: Date, 
        // required: true 
    },

    seatsAvailable: { 
        type: Number, 
        required: true 
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;