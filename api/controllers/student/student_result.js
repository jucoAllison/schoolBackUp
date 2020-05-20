const student_result_schema = require("../../schema/teacher/student_result");

exports.get_result = (req, res) => {
  student_result_schema
    .findOne({
      year_id: req.params.yearID,
      term_id: req.params.termID,
      student_id: req.verify._id,
      class_name_id: req.verify.class_id
    })
    .then(result => {
      if(!result){
        res.status(200).json({Message: true})
      }
      // now for getting all others total in other to calulate the position from the FRONT_END for the particular child
      student_result_schema
        .find({
          year_id: result.year_id,
          term_id: result.term_id,
          class_name_id: result.class_name_id
        })
        .select("student_total")
        .then(found_all => {
          res.status(200).json({ result, all_total: found_all, Message: false });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
