const mongoose = require("mongoose");
const SchCal = require("../../schema/admin/schoolCalendar");

exports.post_cal = (req, res) => {
  let School_Calendar = new SchCal({
    _id: mongoose.Types.ObjectId(),
    calendar: req.body.calendar
  });
  School_Calendar.save()
    .then(result => {
      res
        .status(201)
        .json({ result: { _id: result._id, calendar: result.calendar } });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.get_cal = (req, res) => {
  SchCal.find()
    .select("_id calendar")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

exports.delete_cal = (req, res) => {
  SchCal.findByIdAndDelete({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ Message: "This Calendar Deleted Successfully" });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
