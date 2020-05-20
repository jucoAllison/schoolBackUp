const mongoose = require("mongoose");

let student_schema = mongoose.Schema({
  log_id: String,
  access: String,
  password: String,
  _id: mongoose.Schema.Types.ObjectId,
  class_name: mongoose.Schema.Types.ObjectId,
  full_name: { type: String, required: true },
  age: Number,
  sex: String,
  phone: Number,
  address: String,
  parents_name: String,
  parents_occupation: String,
  religion: String,
  church: String,
  emergency_name: String,
  emergency_phone: Number,
  emergency_address: String,
  emergency_relationship: String,
  // having esterblish this once
  state_of_origin: String,
  lga: String,
  dob: String
});

module.exports = mongoose.model("Student", student_schema);
