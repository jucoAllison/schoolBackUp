const mongoose = require('mongoose');

let admin_message = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: String,
    isRead: {type: String, default: false}
})

module.exports = mongoose.model("Admin_MESSAGES", admin_message)