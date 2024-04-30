const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String, 
        unique: true, 
        required: true
    },
    
    firstName: { 
        type: String, 
        required: true
    },
    
    lastName: { 
        type: String, 
        required: true
    },
    
    password: { 
        type: String, 
        required: true 
    },
    
    age: { 
        type: Number
    },
    
    gender: { 
        type: String, 
        enum: ['Male', 'Female']
    },
    
    profilePicture: String,
    
    role: { 
        type: String, 
        enum: ['driver', 'client'], 
        required: true
    },

    review: {
        stars: { 
            type: Number, 
            min: 0, 
            max: 5 
        },
        comment: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;