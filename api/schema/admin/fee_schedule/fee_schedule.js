const mongoose = require('mongoose');

let new_fee_schedule = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    class_id: mongoose.Schema.Types.ObjectId,
    fee_schedule: Array,
})
module.exports = mongoose.model("fee_schedule", new_fee_schedule)