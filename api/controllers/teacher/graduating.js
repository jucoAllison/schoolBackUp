const student_schema = require("../../schema/teacher/student"),
class_schema = require("../../schema/admin/Classes"),
year_schema = require("../../schema/admin/year_schema"),
term_schema = require("../../schema/admin/term_schema"),
student_result_schema = require("../../schema/teacher/student_result");

// Teacher graduating a student if and only if there is no current result sheet that is not approved yet
exports.graduate = (req, res) => {
    student_schema
      .findOne({ _id: req.params.id })
      .then(result => {
        // finding THE CURRENT CLASS
        class_schema.findOne({ _id: result.class_name }).then(found_class => {
          if (!found_class) {
            res.status(404).json({ Message: "No Student Found" });
          }
          let current_class = found_class.className;
  //  finding the current year and term so that it will use it to find the current result-sheet
          year_schema
            .find()
            .then(found_year => {
              if (found_year.length < 1) {
                res.status(200).json({
                  Message: `There is no found year`
                });
              }
              let year_id = found_year[found_year.length - 1]._id;
              term_schema
                .find()
                .select("_id term")
                .then(found_term => {
                  if (found_term.length < 1) {
                    res.status(200).json({
                      Message: `There is no found term`
                    });
                  }
                  let term = found_term[found_term.length - 1].term;
                  let term_id = found_term[found_term.length - 1]._id;
                  //findign the current result-sheet
                  // if found then check if the result is approved befor graduting
                  student_result_schema
                    .findOne({
                      student_id: result._id,
                      year_id: year_id,
                      term_id: term_id,
                      class_name_id: result.class_name
                    })
                    .exec()
                    .then(foundAnyResult => {
                      // graduating the student
                      if (!foundAnyResult || foundAnyResult.approved) {
                        // Finding the class graduating to
                        class_schema
                          .findOne({ _id: req.body.graduatingClass })
                          .exec()
                          .then(graduating_class => {
                            student_schema
                              .findByIdAndUpdate(
                                { _id: req.params.id },
                                { class_name: graduating_class._id },
                                { new: true }
                              )
                              .exec()
                              .then(result_gra => {
                                // res.json({graduating_class, Name: result.full_name, current_class, classID: graduating_class.className })
                                // sending Message to Admin
                                let Admin_Message = new admin_message({
                                  _id: mongoose.Types.ObjectId(),
                                  message: `${result.full_name.toUpperCase()} has been changed class successfully from ${current_class} to ${
                                    graduating_class.className
                                  }`
                                });
  
                                Admin_Message.save()
                                  .then(message => {
                                    res.status(200).json({
                                      Message: "Graduated Successfully"
                                    });
                                  })
                                  .catch(err =>
                                    res.status(500).json({
                                      Message:
                                        "Can'\t send the message to admin_message",
                                      Error: err
                                    })
                                  );
                              })
                              .catch(err => {
                                res.status(500).json({
                                  Message: "from the main FindOneAndUpdate",
                                  Error: err
                                });
                              });
                          })
                          .catch(err => {
                            res.status(500).json({
                              Error: err,
                              Message: "From Graduating Class"
                            });
                          });
                      } else {
                        // sending message if the result-sheet is not approved yet before graduating
                        res.status(409).json({
                          Message: `${result.full_name} already has a result-sheet that is not approved yet. Delete result-sheet and then Change Class `,
                        // sending the  term result so it can be deleted from the teacher
                          payloads: [{ term, _id:term_id, delete: true }]
                        });
                      }
                    })
                    .catch(err =>
                      res
                        .status(500)
                        .json({ Error: err, Message: "from finding Result" })
                    );
                })
                .catch(err =>
                  res
                    .status(500)
                    .json({ Error: err, Message: "from finding Current term" })
                );
            })
            .catch(err =>
              res.status(500).json({ Error: err, Message: "from CUrrent Year" })
            );
        });
      })
      .catch(err => {
        res.status(500).json({ Error: err });
      });
  };
  