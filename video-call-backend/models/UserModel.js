const mongoose = require("mongoose")

let UserModel = new mongoose.Schema({
    name: { type: String, trim: true },
    photoUrl: { type: String },
    socketId: { type: String },
    online: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now },
    email: { type: String, unique: true },
    profileVerified: { type: Boolean, default: false, required: true },
    contacts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

    ]

})

const User = mongoose.model("User", UserModel)
module.exports = User