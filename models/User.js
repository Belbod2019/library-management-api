// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'attendant', 'admin'],
        required: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        // This will reference either Student or LibraryAttendant based on role
        refPath: 'roleModel'
    },
    roleModel: {
        type: String,
        enum: ['Student', 'LibraryAttendant']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);