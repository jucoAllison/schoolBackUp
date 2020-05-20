const term_schema = require("../../schema/admin/term_schema");
const year_schema = require("../../schema/admin/year_schema");
const student_result_schema = require("../../schema/teacher/student_result");

// management getting all students with there result for Approved or not
exports.get_all_result_for_approval = (req, res) => {
  student_result_schema
    .find({ class_name_id: req.params.classID, term_id: req.params.termID })
    .select("approved full_name _id")
    .then(result => {
      if (result.length === 0) {
        res
          .status(200)
          .json({ Message: "There are no available result-sheet" });
      } else {
        res.status(200).json({ result });
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.get_terms = (req, res) => {
  year_schema
    .find()
    .then(found_year => {
      let year = found_year[found_year.length - 1].year;
      let year_id = found_year[found_year.length - 1]._id;
      term_schema
        .find({ year_id })
        .select("term _id year_id")
        .then(result => {
          res.status(200).json({ result });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// management completing the result for the selected result sheetez
exports.put_remaining_result = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(result => {
      // res.json(result);
      student_result_schema
        .findOneAndUpdate(
          { _id: result._id },
          {
            fees_owning: req.body.fees_owning,
            fees_paid: req.body.fees_paid,
            principal_comment: req.body.principal_comment
          },
          { new: true }
        )
        .then(update => {
          student_result_schema
            .find({
              year_id: result.year_id,
              term_id: result.term_id,
              class_name_id: result.class_name_id
            })
            .select("student_total")
            .then(found_all => {
              // res.status(200).json(result);
              res.status(201).json({ result: update, all_total: found_all });
            });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.approve_result = (req,res) => {
  student_result_schema.findOneAndUpdate({_id: req.params.resultID}, {approved: true},{new: true})
  .then(result => res.status(200).json({Message: "Message Approved Successfully"}))
  .catch(err => res.status(500).json({ Error: err }));
}