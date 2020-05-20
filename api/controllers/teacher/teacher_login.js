const teacher_schema = require("../../schema/admin/addTeacher"),
  classesSchema = require("../../schema/admin/Classes"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema");

// Teacher_Login
exports.teacher_login = (req, res) => {
  year_schema
    .find()
    .select("_id year")
    .then(year_result => {
      let total = year_result.length;
      // res.status(200).json({ result });
      const year_value = year_result[total - 1];
      term_schema
        .find()
        .select("_id term")
        .then(term_result => {
          let total = term_result.length;
          const term_value = term_result[total - 1];

          teacher_schema
            .findOne({ login_id: req.body.login_id.toLowerCase() })
            .then(result => {
              if (!result) {
                res.status(401).json({ Message: "Auth Failed" });
              } else {
                classesSchema
                  .findOne({ _id: result.assignClass })
                  .then(foundClass => {
                    let class_name;
                    if (foundClass === null) {
                      class_name = "No Class";
                    } else {
                      class_name = foundClass.className;
                    }
                    bcrypt.compare(
                      req.body.password,
                      result.password,
                      (err, response) => {
                        if (err) {
                          res.status(401).json({ Message: "Auth Failed" });
                        }
                        if (response) {
                          const token = jwt.sign(
                            {
                              login_id: result.login_id,
                              _id: result._id,
                              assignClass: result.assignClass,
                              full_name: result.full_name,
                              class_name: class_name,
                              handle_result: result.handle_result
                            },
                            process.env.TOKEN,
                            { expiresIn: "24h" }
                          );
                          return res.status(200).json({
                            Message: "Auth Successfull",
                            token: token,
                            full_name: result.full_name,
                            assignClass: result.assignClass,
                            class_name,
                            _id: result._id,
                            login_id: result.login_id,
                            handle_result: result.handle_result,
                            term_value: term_value,
                            year_value: year_value
                          });
                        } else {
                          res.status(401).json({ Message: "Auth Failed" });
                        }
                      }
                    );
                  })
                  .catch(err => {
                    res.status(500).json({ Error: err });
                  });
              }
            })
            .catch(err => res.status(500).json({ Error: err }));
        })
        .catch(err => res.status(500).json({ Error: err }));
    })

    .catch(err => res.status(500).json({ Error: err }));
};

// teacher changing his/her password in the settings
exports.change_password = (req, res) => {
  if (req.body.password.length < 6) {
    res.status(406).json({ Message: "Password length is too short" });
  } else {
    let _id = req.verify._id;
    teacher_schema
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
                  teacher_schema
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
