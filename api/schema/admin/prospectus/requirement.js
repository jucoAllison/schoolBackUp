const mongoose = require('mongoose');

let new_requirement = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requirement: String,
    class_id: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model("Requirements", new_requirement);