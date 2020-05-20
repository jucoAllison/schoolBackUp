const student_result_schema = require("../../schema/teacher/student_result"),
  mongoose = require("mongoose"),
  student_schema = require("../../schema/teacher/student"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema"),
  // class_subject = require("../../schema/admin/class_subjects"),
  class_schema = require("../../schema/admin/Classes");

// posting new result sheet
exports.post_new_result = (req, res) => {
  //
  let class_name_id = req.verify.assignClass;
  if (!class_name_id) {
    res.status(406).json({ Message: "No class_name_id" });
  }
  // getting students details
  student_schema
    .findOne({ _id: req.params.studentID })
    .then(found_student => {
      let { full_name, sex, age, state_of_origin, lga, dob } = found_student;
      let student_id = found_student._id;
      // getting students term
      term_schema
        .find()
        .select("_id term")
        .then(found_term => {
          if (found_term.length < 1) {
            res.status(200).json({
              Message: `There is no found term`
            });
          }
          let term = found_term[found_term.length - 1].term;
          let term_id = found_term[found_term.length - 1]._id;
          // getting students year
          year_schema.find().then(found_year => {
            if (found_year.length < 1) {
              res.status(200).json({
                Message: `There is no found year`
              });
            }
            let year = found_year[found_year.length - 1].year;
            let year_id = found_year[found_year.length - 1]._id;
            // getting students class_name and id
            class_schema.findOne({ _id: class_name_id }).then(found_class => {
              let class_name_id = found_class._id;
              let class_name = found_class.className;
              // getting students class total
              student_schema
                .find({ class_name: found_class._id })
                .select("full_name _id")
                .then(class_totall => {
                  let class_total = class_totall.length;

                  student_result_schema
                    .find({ student_id, year_id, term_id })
                    .then(ok => {
                      let new_result = new student_result_schema({
                        _id: mongoose.Types.ObjectId(),
                        approved: req.body.approved,
                        full_name,
                        student_id,
                        sex,
                        age,
                        state_of_origin,
                        lga,
                        dob,
                        class_name,
                        class_name_id,
                        class_total,
                        student_position: req.body.student_position,
                        student_average: req.body.student_average,
                        subjects: req.body.subjects,
                        performance: req.body.performance,
                        term,
                        term_id,
                        year,
                        year_id,
                        form_teachers_comment: req.body.form_teachers_comment,
                        principal_comment: req.body.principal_comment,
                        times_present: req.body.times_present,
                        times_school_held: req.body.times_school_held,
                        fees_paid: req.body.fees_paid,
                        fees_owning: req.body.fees_owning,
                        next_term_begins: req.body.next_term_begins
                      });
                      if (ok.length === 0) {
                        new_result
                          .save()
                          .then(result => {
                            res.status(201).json({ result });
                          })
                          .catch(err =>
                            res
                              .status(500)
                              .json({ Error: err, Message: "from saving" })
                          );
                      } else {
                        ok.map(v => {
                          if (v.term !== term) {
                            new_result
                              .save()
                              .then(result => {
                                res.status(201).json({ result });
                              })
                              .catch(err =>
                                res
                                  .status(500)
                                  .json({ Error: err, Message: "from saving" })
                              );
                          } else {
                            res.status(406).json({
                              Message:
                                "Can't have doblicate result sheet in a term ",
                              map: v.term,
                              term
                            });
                          }
                        });
                      }
                    });
                })
                .catch(err =>
                  res
                    .status(500)
                    .json({ Error: err, Message: "from class total" })
                );
            });
          });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

//  getting all availabe terms
exports.get_available_term = (req, res) => {
  year_schema
    .find()
    .then(found_year => {
      if (found_year.length < 1) {
        res.status(200).json({
          Message: `There is no found year`
        });
      }
      let year_id = found_year[found_year.length - 1]._id;
      term_schema
        .find()
        .select("_id term")
        .then(found_term => {
          if (found_term.length < 1) {
            res.status(200).json({
              Message: `There is no found term`
            });
          }
          let term = found_term[found_term.length - 1].term;
          let term_id = found_term[found_term.length - 1]._id;
          student_result_schema
            .find({
              student_id: req.params.studentID,
              year_id: year_id,
            })
            .select("term _id")
            .then(result => {
              if (result.length === 0) {
                res.status(404).json({
                  Message: `No Result Sheet Found. Create ${term} term Result Sheet`
                });
              } else {
                let checking = result.filter(v => {
                  return v.term === term;
                });
                if (checking.length === 0) {
                  res.status(200).json({
                    result: result,
                    Message: `Create ${term} term Result Sheet`
                  });
                } else {
                  res
                    .status(200)
                    .json({ result, Message: "Result Sheet is Complete" });
                }
              }
            });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.get_result_with_resultID = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
  
  // getting selected subject value
  exports.get_subject_value = (req, res) => {
    student_result_schema
      .findOne({ _id: req.params.resultID })
      .then(result => {
        const fill = result.subjects.filter(v => {
          return v.sub_id === req.params.subjectID;
        });
        // checking for when fill is an empty array, so that it can show null for any selected subjects
        if (fill.length < 1) {
          res.status(200).json({
            result: { assignment: "", mid_term: "", test: "", exams: "" }
          });
        }
        res.status(200).json({ result: fill[0].scores });
      })
      .catch(err => res.status(500).json({ Error: err }));
  };

//  from front-END
//  set_subjects will be like this
//  {sub_name: "English", sub_id: "4532ece2r4edae3", scores{assignment: "20", test: '9', mid-term: "30", Exams: "32"}}
