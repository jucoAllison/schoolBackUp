const mongoose = require('mongoose');

let AdminLogin = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    main_admin: {type: Boolean, required: true, default: false},
    phone: {type: Number, required: true},
    password: {type: String, required: true},
    allowAccess: {type: Boolean, default: false, required: true}
})

module.exports = mongoose.model("Management_LOGIN", AdminLogin)