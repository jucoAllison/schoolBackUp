const mongoose = require('mongoose');

let YEAR = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    year: {type: Number, required: true}
})
module.exports = mongoose.model("Passion_Years,", YEAR)