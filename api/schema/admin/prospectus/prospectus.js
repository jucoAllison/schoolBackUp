const mongoose = require('mongoose');

let new_prospectus = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    class_id: mongoose.Schema.Types.ObjectId,
    prospectus: Array,
})
module.exports = mongoose.model("Prospectus", new_prospectus)