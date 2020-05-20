const mongoose = require('mongoose')

let Subjects = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classID: mongoose.Schema.Types.ObjectId,
    subjects: {type: String,}
})

module.exports = mongoose.model("Class_Subjects", Subjects);