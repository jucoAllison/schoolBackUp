const mongoose = require('mongoose');

let TERM = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    term: {type: String, required: true},
    year_id: mongoose.Schema.Types.ObjectId
})
module.exports = mongoose.model("Passion_Terms,", TERM)