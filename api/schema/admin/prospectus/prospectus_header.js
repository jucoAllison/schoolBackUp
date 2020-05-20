const mongoose = require("mongoose");

let prospectus_header_schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  header: { type: String, required: true }
});

module.exports = mongoose.model("Propspectus_Header", prospectus_header_schema);
