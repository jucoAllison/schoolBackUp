const mongoose = require("mongoose"),
  fee_schedule_header_schema = require("../../schema/admin/fee_schedule/fee_schedule_header"),
  fee_schedule_schema = require("../../schema/admin/fee_schedule/fee_schedule");

//  admin getting all the fee_schedule_headers
exports.get_fee_schedule_header = (req, res) => {
  fee_schedule_header_schema
    .find()
    .then(result => {
      if (result.length < 1) {
        res.status(200).json({
          Message: "There are no fee schedule headers. Add headers to continue",
          result: [
            { _id: "", header: "" },
            { _id: "", header: "" }
          ]
        });
      }
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Erro: err }));
};

//  admin posting a new fee_schedule_header
exports.post_fee_schedule_header = (req, res) => {
  let new_header = new fee_schedule_header_schema({
    _id: mongoose.Types.ObjectId(),
    header: req.body.header
  });
  new_header
    .save()
    .then(result => {
      res.status(201).json({ result: result });
    })
    .catch(err => res.status(500).json({ Erro: err }));
};

// admin deleting any fee_Header if allowAccess is true
exports.delete_fee_schedule_header = (req, res) => {
  let check_access = req.verify.allowAccess;
  if (!check_access) {
    res
      .status(406)
      .json({ Message: "Can't perform this operation. You have no access" });
    return null;
  } else {
    fee_schedule_header_schema
      .findByIdAndDelete({ _id: req.params._id })
      .then(result => {
        res.status(200).json({ Message: "Ok" });
      })
      .catch(err => res.status(500).json({ Error: err }));
  }
};

// admin getting each class fee schedule and setting up the fee_schedule if the class do not have one
exports.get_fee_schedule_for_class = (req, res) => {
  fee_schedule_schema
    .findOne({ class_id: req.params.classID })
    .then(ok => {
      fee_schedule_header_schema
        .find()
        .select("_id header")
        .then(found_headers => {
          // if the gotten class do not have any fee_schedule posted already in other for the put to be functional, it has to post
          if (ok === null) {
            let new_post = new fee_schedule_schema({
              _id: mongoose.Types.ObjectId(),
              class_id: req.params.classID,
              fee_schedule: req.body.fee_schedule
            });
            new_post
              .save()
              .then(result => {
                // now after ever the selected class is now with a fee_schedule, we will now get the fee_schedule headers
                res.status(201).json({ result: result.fee_schedule, headers: found_headers });
              })
              .catch(err => res.status(500).json({ Error: err }));
          } else {
            res.status(200).json({ result: ok.fee_schedule, headers: found_headers });
          }
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin changing the already created fee_schedule
exports.put_fee_schedule_for_class = (req, res) => {
  fee_schedule_schema
    .findOne({ class_id: req.params.classID })
    .then(found_class => {
      fee_schedule_schema
        .findOneAndUpdate(
          { _id: found_class._id },
          { fee_schedule: req.body.fee_schedule },
          { new: true }
        )
        .then(result => {
          res.status(201).json({ result: result.fee_schedule });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
