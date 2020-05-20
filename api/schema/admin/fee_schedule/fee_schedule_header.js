const mongoose = require('mongoose');

let fee_schedule_header = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    header: {type: String, required: true},
})

module.exports = mongoose.model("Fee_Schedule_Header", fee_schedule_header)