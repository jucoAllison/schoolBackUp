const student_result_schema = require("../../schema/teacher/student_result"),
  mongoose = require("mongoose"),
  student_schema = require("../../schema/teacher/student"),
  subject_schema = require("../../schema/admin/class_subjects"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema"),
  class_subject = require("../../schema/admin/class_subjects"),
  class_schema = require("../../schema/admin/Classes");

exports.get_all_student = (req, res) => {
  let ok = req.verify.assignClass;
  subject_schema
    .findOne({ _id: req.params.subjectID })
    .select("subjects")
    .then(found_subject => {
      let subject_name = found_subject.subjects;
      let subject_id = found_subject._id;
      term_schema
        .find()
        .select("_id term")
        .then(found_term => {
          let term = found_term[found_term.length - 1].term;
          let term_id = found_term[found_term.length - 1]._id;
          student_result_schema
            .find({ term_id: term_id, class_name_id: ok })
            .select("subjects full_name student_id")
            .then(found => {
              // res.status(200).json({term, found})
              student_schema
                .find({ class_name: ok })
                .select("full_name _id")
                .then(found_class => {
                  let non_result_sheet = found_class.filter(
                    v => !found.some(b => v.full_name == b.full_name)
                  );
                  let fill = found.map(v => {
                    return {
                      _id: v.student_id,
                      full_name: v.full_name,
                      scores: v.subjects.filter(b => {
                        return b.sub_id === req.params.subjectID;
                      })
                    };
                  });
                  let CHECKING = fill.map(q => {
                    if (q.scores.length == 0) {
                      return {
                        _id: q._id,
                        full_name: q.full_name,
                        scores: {
                          sub_name: subject_name,
                          sub_id: subject_id,
                          scores: {
                            assignment: "",
                            test: "",
                            mid_term: "",
                            exams: ""
                          }
                        }
                      };
                    } else if (q.scores.length > 0) {
                      return {
                        _id: q._id,
                        full_name: q.full_name,
                        scores: {
                          sub_name: q.scores[q.scores.length - 1].sub_name,
                          sub_id: q.scores[q.scores.length - 1].sub_id,
                          scores: {
                            assignment: q.scores[q.scores.length - 1].scores.assignment,
                            test: q.scores[q.scores.length - 1].scores.test,
                            mid_term: q.scores[q.scores.length - 1].scores.mid_term,
                            exams: q.scores[q.scores.length - 1].scores.exams
                          }
                        }
                      };
                    }
                  });
                  let spread = [...non_result_sheet, ...CHECKING];
                  res.status(200).json({ result: spread, term });
                })
                .catch(err => res.status(500).json({ Error: err }));
            });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
