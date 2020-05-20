const student_result_schema = require("../../schema/teacher/student_result"),
  mongoose = require("mongoose"),
  student_schema = require("../../schema/teacher/student"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema"),
  class_subject = require("../../schema/admin/class_subjects"),
  class_schema = require("../../schema/admin/Classes");

// for handle_result for secondary teachers
// first for any teacher to get subjects the form teacher must have created the result sheet
exports.get_handle_result = (req, res) => {
  term_schema
    .find()
    // .select("_id year_id")
    .then(found_term => {
      if (found_term.length < 1) {
        res.status(200).json({
          Message: `There is no found term`
        });
      }
      let term_id = found_term[found_term.length - 1]._id;
      year_schema.find().then(found_year => {
        if (found_year.length < 1) {
          res.status(200).json({
            Message: `There is no found year`
          });
        }
        let year_id = found_year[found_year.length - 1]._id;
        student_schema
          .findOne({ _id: req.params.studentID })
          .select("full_name _id")
          .then(found_student => {
            student_result_schema
              .findOne({
                term_id: term_id,
                year_id: year_id,
                class_name_id: req.params.classID,
                student_id: req.params.studentID
              })
              .then(result => {
                if (!result) {
                  res.status(200).json({
                    Message: `There is no current result sheet for ${found_student.full_name} now ask teacher to create one`
                  });
                } else {

                // now filltering the subject array to the one put through params
                const fill = result.subjects.filter(v => {
                  return v.sub_id === req.params.subjectID;
                  full_name;
                });

                if (fill.length < 1) {
                  res.status(200).json({
                    result: {
                      assignment: "",
                      mid_term: "",
                      test: "",
                      exams: ""
                    },
                    result_id: result._id
                  });
                }
                res
                  .status(200)
                  .json({ result: fill[0].scores, result_id: result._id });

                // res.status(200).json({ result });
              }
            });
          })
          .catch(err => {
            req.status(500).json({ Error: err });
          });
      });
    })
    .catch(err => res.status(500).json({ Error: "err" }));
};

exports.post_handle_result = (req, res) => {
  term_schema
    .find()
    // .select("_id year_id")
    .then(found_term => {
      let term_id = found_term[found_term.length - 1]._id;
      year_schema
        .find()
        .then(found_year => {
          let year_id = found_year[found_year.length - 1]._id;
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
