const school_policy_schema = require("../../schema/admin/school_policy");
const mongoose = require("mongoose");

exports.get_school_policy = (req, res) => {
  school_policy_schema.find().select('_id school_policy')
  .then(result => {
    // res.status(200).json({ result: result });
    if (result.length == 0) {
        let new_policy = new school_policy_schema({
          _id: mongoose.Types.ObjectId(),
          school_policy: req.body.school_policy
        });
        res.status(200).json({ result: result });
        new_policy.save().then(saved => {
          res.status(200).json({ result: saved[0] });
        });
      } else {
        res.status(200).json({ result: result[0] });
      }
    })
    .catch(err => res.status(500).json({ Erro: err }));
};

exports.put_school_policy = (req, res) => {
  //   school_policy_schema.find();
  school_policy_schema
    .findOneAndUpdate(
      { _id: req.params._id },
      { school_policy: req.body.school_policy },
      { new: true }
    )
    .then(result => {
      res.status(201).json({ result: result });
    })
    .catch(err => res.status(500).json({ Erro: err }));
};
