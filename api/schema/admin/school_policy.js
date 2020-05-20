const mongoose = require("mongoose");

let school_policy = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  school_policy: String
});

module.exports = mongoose.model("School_Policy", school_policy);