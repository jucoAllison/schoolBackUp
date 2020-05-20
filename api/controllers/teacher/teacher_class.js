const sch_cal = require("../../schema/admin/schoolCalendar");
const fee_schedule = require("../../schema/admin/fee_schedule/fee_schedule");
const student_schema = require("../../schema/teacher/student");
const class_schema = require("../../schema/admin/Classes");

exports.get_calendar = (req, res) => {
  sch_cal
    .find()
    .select("_id calendar")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// teacher getting fee_schedule
exports.get_class_fee_schedule = (req, res) => {
  console.log(req.params.classID)
  let class_id = req.params.classID;
  fee_schedule
    .findOne({ class_id: class_id })
    .select("fee_schedule")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// teacher getting the total number of students assigned to the same class he/she is teaching
exports.get_studentsTotal = (req, res) => {
  student_schema
    .find({ class_name: req.verify.assignClass })
    .then(result => {
      res.status(200).json({ result: result.length });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// teacher showing the list of classes to be graduated to
exports.graduate_next_class = (req, res) => {
  let _id = req.verify.assignClass;
  class_schema
    .find()
    .select("_id className")
    .then(result => {
      if (!_id) {
        res.status(200).json({ Message: "You can't graduate any student" });
      } else {
        class_schema
          .findOne({ _id })
          .select("_id className")
          .then(found_class => {
            let FindingID = result.findIndex(
              ok => ok.className == found_class.className
            );
            let combine = [
              result[FindingID - 1],
              result[FindingID + 1]
            ];
            res.status(200).json({ result: combine });
          })
          .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};
