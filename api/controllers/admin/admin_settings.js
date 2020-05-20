const adminLogin = require("../../schema/admin/adminLogin"),
  bcrypt = require("bcrypt"),
  year_schema = require("../../schema/admin/year_schema"),
  term_schema = require("../../schema/admin/term_schema"),
  jwt = require("jsonwebtoken"),
  mongoose = require("mongoose");

//   admin signing up another Management if YOur Allow Access is True
exports.create_new_admin = (req, res) => {
  let _id = req.verify._id;
  adminLogin.findOne({ _id }).then(result => {
    if (result.allowAccess) {
      adminLogin
        .find({ username: req.body.username })
        .then(result => {
          if (result.length >= 1) {
            return res.status(409).json({
              Message: "UserName Exits"
            });
          } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({ Error: err });
              } else {
                let Details = new adminLogin({
                  _id: mongoose.Types.ObjectId(),
                  username: req.body.username,
                  allowAccess: req.body.allowAccess,
                  main_admin: req.body.main_admin,
                  phone: req.body.phone,
                  password: hash
                });
                Details.save()
                  .then(result => {
                    res.status(201).json({
                      Message: "New Management Created Successfully",
                      result: {
                        allowAccess: result.allowAccess,
                        phone: result.phone,
                        _id: result._id,
                        username: result.username,
                        main_admin: result.main_admin
                      }
                    });
                  })
                  .catch(err => res.status(500).json({ Error: err }));
              }
            });
          }
        })
        .catch(err => res.status(500).json({ Error: err }));
    } else {
      res
        .status(403)
        .json({ Message: "You are not authorize to create new management" });
    }
  });
};

//   MAnagement LOGIN admin login
exports.admin_login = (req, res) => {
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

          adminLogin
            .findOne({ username: req.body.username.toLowerCase() })
            .then(result => {
              if (!result) {
                return res.status(401).json({ Message: "Auth Failed" });
              }
              bcrypt.compare(
                req.body.password,
                result.password,
                (err, response) => {
                  if (err) {
                    return res.status(401).json({ Message: "Auth Failed" });
                  }
                  if (response) {
                    const token = jwt.sign(
                      {
                        allowAccess: result.allowAccess,
                        username: result.username,
                        _id: result._id,
                      },
                      process.env.TOKEN,
                      { expiresIn: "24h" }
                    );
                    return res.status(200).json({
                      Message: "Auth Successfull",
                      token: token,
                      term_value: term_value,
                      year_value: year_value,
                      allowAccess: result.allowAccess,
                      main_admin: result.main_admin
                    });
                  } else {
                    return res.status(401).json({ Message: "Auth Failed" });
                  }
                }
              );
              // res.json({result})
            })
            .catch(err => res.status(500).json({ Error: err }));
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// Management UPDateing UserNAme their username
exports.change_username = (req, res) => {
  let id = req.verify._id;
  if (req.body.username.length < 6) {
    res.status(406).json({ Message: "User Name is too short" });
  }
  adminLogin
    .findOne({ _id: id })
    .then(result => {
      // res.json({result})
      if (req.body.oldUsername === result.username) {
        adminLogin.find({ username: req.body.username }).then(result => {
          if (result.length >= 1) {
            return res.status(409).json({
              Message: "UserName Exits"
            });
          } else {
            adminLogin
              .findOneAndUpdate(
                { _id: result._id },
                { username: req.body.username },
                { new: true }
              )
              .then(changeSuccess => {
                res.status(201).json({
                  Message: `Username Changed Successfully to "${req.body.username}"`
                });
              });
          }
        });
      } else {
        res.status(403).json({ Message: "Username Doesn't match" });
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// Management UPDateing PASSWORD their password
exports.change_password = (req, res) => {
  let _id = req.verify._id;
  if (req.body.password.length < 6) {
    res.status(406).json({ Message: "Password length is too short" });
  } else {
    adminLogin
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
                  adminLogin
                    .findOneAndUpdate(
                      { _id: result._id },
                      { password: hash },
                      { new: true }
                    )
                    .then(changeSuccess => {
                      res.status(201).json({
                        Message:
                          "Password Changed Successfully. Use it next time"
                      });
                    })
                    .catch(err => res.json({ err }));
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

// admin posting latest year
exports.post_latest_year = (req, res) => {
  year_schema
    .find()
    .then(found => {
      let total = found.length;
      if (total === 0) {
        let new_year = new year_schema({
          _id: mongoose.Types.ObjectId(),
          year: req.body.year
        });
        new_year.save().then(result => {
          res
            .status(201)
            .json({ Message: "YEAR posted successfully", result: result });
        });
      } else if (req.body.year !== found[total - 1].year + 1) {
        res.status(403).json({ Message: "Check YEAR and continue" });
        UUID;
      } else {
        let new_year = new year_schema({
          _id: mongoose.Types.ObjectId(),
          year: req.body.year
        });
        new_year.save().then(result => {
          res
            .status(201)
            .json({ Message: "YEAR posted successfully", result: result });
        });
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin posting latest TERM
exports.post_latest_term = (req, res) => {
  if (req.body.term === "1" || req.body.term === "2" || req.body.term === "3") {
    let CHECKiNG = null;
    switch (req.body.term) {
      case "1":
        CHECKiNG = "1st";
        break;
      case "2":
        CHECKiNG = "2nd";
        break;
      case "3":
        CHECKiNG = "3rd";
        break;

      default:
        CHECKiNG = null;
    }

    year_schema
      .find()
      .then(result => {
        let total = result.length;
        let year_id = result[total - 1]._id;
        term_schema.find({ year_id }).then(hello => {
          let Duplicate = hello.filter(v => {
            return CHECKiNG === v.term;
          });
          if (Duplicate.length > 0) {
            res.status(403).json({ Message: "Term already exits" });
          } else if (Duplicate.length === 0) {
            let new_term = new term_schema({
              _id: mongoose.Types.ObjectId(),
              term: CHECKiNG,
              year_id: year_id
            });
            new_term.save().then(term => {
              res
                .status(201)
                .json({ term, Message: "Term posted successfully" });
            });
          } else {
            res.status(403).json({ Message: "Invalid Term" });
          }
        });
      })
      .catch(err => res.status(500).json({ Error: err, Message: "Invalid Input" }));
  } else {
    res.status(403).json({ Message: "Invalid Term" });
  }
};

// admin updating or changing his or her phone_number
exports.update_phone_number = (req, res) => {
  adminLogin
    .find({ phone: req.body.new_phone })
    .then(found_any => {
      if (found_any.length > 0) {
        res
          .status(200)
          .json({
            Message: "Phone Number already exist, please choose a new number"
          });
      } else {
        let _id = req.verify._id;

        adminLogin
          .findOne({ _id })
          .then(result => {
            if (
              result.phone == req.body.old_phone &&
              req.body.new_phone.length === 13
            ) {
              adminLogin
                .findOneAndUpdate(
                  { _id: result._id },
                  { phone: +req.body.new_phone },
                  { new: true }
                )
                .then(done => {
                  res
                    .status(200)
                    .json({ Message: "Phone Number Updated Successfully" });
                })
                .catch(err => res.status(500).json({ Error: err }));
            } else {
              res.status(200).json({ Message: "Check number and try again" });
            }
          })
          .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};
