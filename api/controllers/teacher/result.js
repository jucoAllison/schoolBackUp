const student_result_schema = require("../../schema/teacher/student_result");
// const class_subject = require("../../schema/admin/class_subjects");
const class_performance = require("../../schema/admin/class_performance");

// teacher updating, changing teachers comment
exports.put_teachers_comment = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(found => {
      student_result_schema
        .findOneAndUpdate(
          { _id: found._id },
          { form_teachers_comment: req.body.form_teachers_comment },
          { new: true }
        )
        .then(result => [
          res.status(201).json({ result: result.form_teachers_comment })
        ])
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// this route is for getting all the requred inputs that is performance, teachers comments, and total with average
exports.other_input = (req, res) => {
  // this is getting class performance where if {performance.length === 0 ? normal performance from admin : performance from the student result}
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .select(
      "performance form_teachers_comment class_total student_average student_total fees_paid fees_owning _id year_id term_id times_school_held times_present class_name_id"
    )
    .then(found_result => {
      // this is now getting all the students in the same term, year, and class for bringing all there total and scaning them for the current student position
      student_result_schema
        .find({
          year_id: found_result.year_id,
          term_id: found_result.term_id,
          class_name_id: found_result.class_name_id
        })
        .select("student_total")
        .then(found_all_student_result => {
          // res.json({ found_result });
          if (found_result.performance.length == 0) {
            let assingClass = req.verify.assignClass;
            class_performance
              .find({ classID: assingClass })
              .select("performance _id")
              .then(result => {
                res.status(200).json({
                  performance: result,
                  comment: found_result.form_teachers_comment,
                  total: found_result.student_total,
                  average: found_result.student_average,
                  fees_owning: found_result.fees_owning,
                  fees_paid: found_result.fees_paid,
                  out_of: found_result.class_total,
                  all_total: found_all_student_result,
                  times_present: found_result.times_present,
                  times_school_held: found_result.times_school_held
                });
              });
          } else {
            res.status(200).json({
              performance: found_result.performance,
              comment: found_result.form_teachers_comment,
              total: found_result.student_total,
              average: found_result.student_average,
              fees_owning: found_result.fees_owning,
              fees_paid: found_result.fees_paid,
              out_of: found_result.class_total,
              all_total: found_all_student_result,
              times_present: found_result.times_present,
              times_school_held: found_result.times_school_held
            });
          }
        });
    })
    .catch(err => res.status(500).json({ Error: err }));

  // teacher getting the availble teachers comment
};

// teacher getting result for the particular resultID
exports.get_this_result = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .select(
      "full_name sex age lga dob state_of_origin class_name class_total student_average year_id term_id class_name_id student_total subjects performance term year form_teachers_comment principal_comment times_present times_school_held fees_paid fees_owning next_term_begins"
    )
    .then(result => {
      student_result_schema
        .find({
          year_id: result.year_id,
          term_id: result.term_id,
          class_name_id: result.class_name_id
        })
        .select("student_total")
        .then(found_all => {
          // res.status(200).json(result);
          res.status(200).json({ result, all_total: found_all });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
