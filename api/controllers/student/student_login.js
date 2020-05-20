const student_schema = require("../../schema/teacher/student");
const class_schema = require("../../schema/admin/Classes");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.student_login = (req, res) => {
  student_schema
    .findOne({ log_id: req.body.log_id })
    .then(found_student => {
      if (!found_student) {
        res.status(401).json({ Message: "Auth Failed" });
      } else {
        class_schema
          .findOne({ _id: found_student.class_name })
          .then(found_class => {
            bcrypt.compare(
              req.body.password,
              found_student.password,
              (err, response) => {
                if (err) {
                  res.status(401).json({ Message: "Auth Failed" });
                }
                if (response) {
                  const token = jwt.sign(
                    {
                      _id: found_student._id,
                      full_name: found_student.full_name,
                      log_id: found_student.log_id,
                      class_id: found_student.class_name
                    },
                    process.env.TOKEN,
                    {
                      expiresIn: "24h"
                    }
                  );
                  res.status(200).json({
                    token: token,
                    details: {
                      class_id: found_student.class_name,
                      student_id: found_student._id,
                      login_id: found_student.log_id,
                      class_name: found_class.className,
                      full_name: found_student.full_name,
                      parents_name: found_student.parents_name,
                      parents_occupation: found_student.parents_occupation,
                      church: found_student.church,
                      address: found_student.address,
                      age: found_student.age,
                      emergency_address: found_student.emergency_address,
                      emergency_name: found_student.emergency_name,
                      emergency_phone: found_student.emergency_phone,
                      emergency_relationship:
                        found_student.emergency_relationship,
                      phone: found_student.phone,
                      religion: found_student.religion,
                      sex: found_student.sex,
                      dob: found_student.dob,
                      lga: found_student.lga,
                      state_of_origin: found_student.state_of_origin
                    }
                  });
                } else {
                  res.status(401).json({ Message: "Auth Failed" });
                }
              }
            );
            //  res.status(200).json({ result: found_student });
          })
          .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// student changing or updating his/her password
exports.update_password = (req, res) => {
  if (req.body.password.length < 6) {
    res.status(406).json({ Message: "Password length is too short" });
  } else {
    let _id = req.verify._id;
    student_schema
    .findOne({ _id })
      .then(result => {
        bcrypt.compare(
          req.body.oldPassword,
          result.password,
          (err, response) => {
            if (err) {
              res.status(403).json({ Message: "Old Password is Incorrect" });
            }
            if (response) {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  res.status(500).json({ Error: err });
                } else {
                  student_schema
                    .findOneAndUpdate(
                      { _id },
                      { password: hash },
                      { new: true }
                    )
                    .then(changeSuccess => {
                      res.status(201).json({
                        Message:
                          "Password Changed Successfully. Use it next time"
                      });
                    })
                    .catch(err => res.json({ Error: err }));
                }
              });
            } else {
              res.status(403).json({ Message: "Old Password is Incorrect" });
            }
          }
        );
      })
      .catch(err => res.status(500).json({ Error: err }));
  }
};
