const student_result_schema = require("../../schema/teacher/student_result"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema");

exports.delete_this_result = (req, res) => {
  student_result_schema.findOne({});
  student_result_schema
    .findOneAndDelete({ _id: result._id })
    .then(resultDeleted => {
      res.status(200).json({ Message: "Result Deleted" });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
