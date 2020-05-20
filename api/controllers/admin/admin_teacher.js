const mongoose = require("mongoose");
const addTeacherSchema = require("../../schema/admin/addTeacher");
const bcrypt = require("bcrypt");
const class_schema = require("../../schema/admin/Classes");

exports.new_teacher = (req, res) => {
  addTeacherSchema
    .find({ login_id: req.body.login_id })
    .then(found => {
      if (found.length > 0) {
        return res.status(403).json({ Message: "Login_Id is already in use" });
      } else {
        bcrypt.hash("1234567", 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ Error: "err hashing" });
          } else {
            let newTeacher = new addTeacherSchema({
              _id: mongoose.Types.ObjectId(),
              assignClass: req.body.assignClass,
              assignClassName: req.body.assignClassName,
              handleResult: req.body.handleResult,
              login_id: req.body.login_id,
              password: hash,
              sex: req.body.sex,
              full_name: req.body.full_name,
              state: req.body.state,
              lga: req.body.lga,
              address: req.body.address,
              phone: req.body.phone,
              nok: req.body.nok,
              nok_phone: req.body.nok_phone
            });
            newTeacher
              .save()
              .then(result => {
                res.status(201).json({
                  full_name: result.full_name,
                  _id: result._id,
                  assignClass: result.assignClass
                });
              })
              .catch(err => res.status(500).json({ Error: "err in hasing" }));
          }
        });
      }
    })
    .catch(err => res.status(500).json({ Error: "err in finding" }));
};

// Getting All Teachers
exports.get_all_teacher = (req, res) => {
  addTeacherSchema
    .find()
    .select(
      "_id assignClass login_id full_name state lga address phone nok nok_phone"
    )
    .then(result => {
      let total = result.length;
      res.status(200).json({ result, total });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// ADMIN CHANGING TEACHERS DETAILS
exports.edit_teacher = (req, res) => {
  addTeacherSchema
    .findOne({ _id: req.params.id })
    .then(found_teacher => {
      let new_teacher = {
        full_name: req.body.full_name || found_teacher.full_name,
        state: req.body.state || found_teacher.state,
        lga: req.body.lga || found_teacher.lga,
        sex: req.body.sex || found_teacher.sex,
        address: req.body.address || found_teacher.address,
        phone: req.body.phone || found_teacher.phone,
        nok: req.body.nok || found_teacher.nok,
        nok_phone: req.body.nok_phone || found_teacher.nok_phone
      };
      addTeacherSchema.findOneAndUpdate(
        { _id: found_teacher._id },
        {
          full_name: new_teacher.full_name,
          state: new_teacher.state,
          lga: new_teacher.lga,
          sex: new_teacher.sex,
          address: new_teacher.address,
          phone: new_teacher.phone,
          nok: new_teacher.nok,
          nok_phone: new_teacher.nok_phone
        },
        { new: true }
      )
      .then(result => {
        res.status(201).json({Message: "Teacher details, successfully changed"})
      })
    .catch(err => res.status(500).json({ Error: err }));
  })
    .catch(err => res.status(500).json({ Error: err }));
};

// Assigning Teachers Each Class
exports.assign_teacher_class = (req, res) => {
  class_schema
    .findOne({ _id: req.body.assignClass })
    .then(found_Class => {
      addTeacherSchema
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            assignClass: req.body.assignClass,
            assignClassName: found_Class.className
          },
          { new: true }
        )
        .then(result =>
          res.status(200).json({ assignClass: result.assignClass })
        )
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
// removing assigned teacher
exports.remove_assign_teacher = (req, res) => {
  addTeacherSchema
    .findOneAndUpdate(
      { _id: req.params.id },
      { assignClass: null, assignClassName: "" },
      { new: true }
    )
    .then(result => res.status(200).json({ assignClass: result.assignClass }))
    .catch(err => res.status(500).json({ Error: err }));
};

// Deleting any Teacher
exports.delete_class_teacher = (req, res) => {
  addTeacherSchema
    .findOneAndDelete({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ Message: "Teacher Deleted Successfully" });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// Changing teacher password
exports.change_password = (req, res) => {
  addTeacherSchema
    .findOne({ _id: req.params.id })
    .then(result => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ Message: "Error Hashing" });
        } else {
          addTeacherSchema
            .findOneAndUpdate(
              { _id: result._id },
              { password: hash },
              { new: true }
            )
            .then(update =>
              res.status(201).json({ Message: "Updated Password Successfully" })
            )
            .catch(err => res.json({ err }));
        }
      });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// gettin Each Teacher with assignClass
exports.get_each_teacher = (req, res) => {
  addTeacherSchema
    .find({ assignClass: req.params.classId })
    .select("full_name _id")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// gettin Each Teacher with teacherID  and assingnClassName;
exports.get_each_teacher_with_id = (req, res) => {
  addTeacherSchema
    .findOne({ _id: req.params.id })
    .select(
      "_id assignClassName assignClass login_id full_name state lga address phone nok nok_phone handle_result"
    )
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin and secondary teachers i.e. admin telling teacher what class and with the subject he/she is to handle
exports.put_handle_result = (req, res) => {
  addTeacherSchema
    .findOneAndUpdate(
      { _id: req.params.teacherID },
      { handle_result: req.body.handle_result },
      { new: true }
    )
    .then(result => {
      res.status(201).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
// admin removing or setting handle_result to 0
exports.remove_handle_result = (req, res) => {
  addTeacherSchema
    .findOne({ _id: req.params.teacherID })
    .then(foundTeacher => {
      addTeacherSchema
        .findOneAndUpdate(
          { _id: foundTeacher._id },
          { handle_result: (foundTeacher.handle_result.length = 0) },
          { new: true }
        )
        .then(result => {
          res.status(200).json({ result });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
