const class_subject = require("../../schema/admin/class_subjects"),
  class_performance = require("../../schema/admin/class_performance"),
  mongoose = require("mongoose"),
  student_result_schema = require("../../schema/teacher/student_result");
const message_schema = require("../../schema/admin/messages");

exports.get_class_subject = (req, res) => {
  let assingClass = req.verify.assignClass;
  class_subject
    .find({ classID: assingClass })
    .select("subjects _id")
    .then(result => {
      res.status(200).json({ result });
      other_input;
    })
    .catch(err => res.status(500).json({ Error: err }));
};

//  this shoudn't be here but just putting it here because of the extra space in here
//  this route sends message to the admin for approval of the finshed result
exports.submittResult = (req, res) => {
  student_result_schema
    .findOne({ _id: req.params.resultID })
    .then(found_result => {
      if (found_result.approved) {
        res.json({ Message: "Result Submitted Successfully." });
      } else {
        let newMessage = new message_schema({
          _id: mongoose.Types.ObjectId(),
          message: `Done with ${found_result.term} term result for ${found_result.full_name}. Result waiting for approval`
        });
        newMessage
          .save()
          .then(result => {
            student_result_schema
              .findOneAndUpdate(
                { _id: found_result._id },
                { approved: false },
                { mew: true }
              )
              .then(changed => {
                res
                  .status(200)
                  .json({ Message: "Result Submitted Successfully." });
              })
              .catch(err => res.status(500).json({ Error: err }));
          })
          .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};
