const mongoose = require('mongoose')

let Performance = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classID: mongoose.Schema.Types.ObjectId,
    performance: {type: String,}
})

module.exports = mongoose.model("Class_Performance", Performance);