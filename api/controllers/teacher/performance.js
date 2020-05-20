const student_result_schema = require("../../schema/teacher/student_result");

exports.fill_performance = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(result => {
      student_result_schema
        .findOneAndUpdate(
          { _id: result._id },
          { performance: req.body.performance },
          { new: true }
        )
        .then(saved_performance => {
          res.status(201).json({ result: saved_performance.performance });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.clear_performance = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(result => {
      student_result_schema
        .findOneAndUpdate(
          { _id: result._id },
          { performance: [] },
          { new: true }
        )
        .then(saved_performance => {
          res.status(201).json({ result: saved_performance.performance });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.put_no_of_times = (req, res) => {
  student_result_schema
    .findOneAndUpdate(
      { _id: req.params.resultID },
      {
        times_present: req.body.times_present,
        times_school_held: req.body.times_school_held
      },
      { new: true }
    )
    .then(change_result => {
      res
        .status(201)
        .json({
          times_school_held: change_result.times_school_held,
          times_present: change_result.times_present
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
