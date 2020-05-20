const mongoose = require("mongoose");

let student_result = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  approved: {type: Boolean, default: false},
  full_name: String,
  student_id: mongoose.Schema.Types.ObjectId,
  sex: String,
  age: Number,
  state_of_origin: String,
  lga: String,
  dob: String,
  class_name: String,
  class_name_id: mongoose.Schema.Types.ObjectId,
  class_total: Number,
  student_position: Number,
  student_average: String,
  student_total: Number,
  subjects: Array,
  performance: Array,
  term: String,
  term_id: mongoose.Schema.Types.ObjectId,
  year: String,
  year_id: mongoose.Schema.Types.ObjectId,
  form_teachers_comment: String,
  principal_comment: String,
  times_present: Number,
  times_school_held: Number,
  fees_paid: String,
  fees_owning: String,
  next_term_begins: String
});

module.exports = mongoose.model("Student_Result", student_result);
