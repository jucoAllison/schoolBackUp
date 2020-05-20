const mongoose = require('mongoose');

let SchCal = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    calendar: {type: String, required: true}
})

module.exports = mongoose.model("School_Calendar", SchCal);