const mongoose = require('mongoose');

let classes = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    className: {type: String, require: true },
})
module.exports = mongoose.model("Classes", classes)