const mongoose = require('mongoose');

let add_teacher = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignClass: {type: mongoose.Schema.Types.ObjectId},
    assignClassName: String,
    // handle result is for secondary teachers that has different classes with different subjects.
    handle_result: {type: Array},
    login_id: {type: String, required: true},
    password: {type: String, required: true, default: "1234567"},
    full_name: {type: String, required: true},
    state: {type: String, required: true},
    lga: {type: String, required: true},
    sex: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    nok: {type: String, required: true},
    nok_phone: {type: Number, required: true}
})

module.exports = mongoose.model("Teacher", add_teacher);