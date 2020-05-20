const student_result_schema = require("../../schema/teacher/student_result");
const class_subject = require("../../schema/admin/class_subjects");

// filling Result__Subjects
exports.fill_subjects = (req, res) => {
    student_result_schema
      .findOne({ _id: req.params.resultID })
      .then(result => {
        // now this is for posting new subjject scores after it, it will fetch all the total-subject-score and add it to the resul_tsheet
        if (result.subjects.length === 0) {
          // if the result subject is empty, this code will only push anything coming to the database to the subject
          let spread = [...result.subjects];
          spread.push(req.body.set_subjects);
          // res.json({result})
          student_result_schema
            .findOneAndUpdate(
              { _id: result._id },
              { subjects: spread },
              { new: true }
            )
            .then(saved_result => {
              res.json({
                result: saved_result.subjects[0].scores
              });
            })
            .catch(err =>
              res
                .status(500)
                .json({ Error: err, Message: "from no found result subjects" })
            );
        } else if (result.subjects.length > 0) {
          result.subjects.map((v, i) => {
            // if the subjects in the database do not match the one comming from the teacher, this code will only push anything coming to the database to the subject
            if (v.sub_id !== req.body.set_subjects.sub_id) {
              let spread = [...result.subjects];
              spread.push(req.body.set_subjects);
              // now checking for if they will be multiple
              let un_check = spread.filter(v => {
                return v.sub_id !== req.body.set_subjects.sub_id
              }) 
              let check = spread.filter(v => {
                return v.sub_id == req.body.set_subjects.sub_id
              })
              // now for removing the last in the array which is the correct one
              let check_pop = check.pop() 
  
              let fix_check = [...un_check, check_pop] 
              
              console.log(check)
              console.log(check_pop)
              console.log(fix_check)
  
  
              student_result_schema
                .findOneAndUpdate(
                  { _id: result._id },
                  { subjects: fix_check },
                  { new: true }
                )
                .then(saved_result => {
                  res.json({
                    result:
                      saved_result.subjects[saved_result.subjects.length - 1]
                        .scores
                  });
                })
                .catch(err =>
                  res.status(500).json({
                    Error: err,
                    Message:
                      "from found one or two but not equal to the one you are bringing result subjects"
                  })
                );
            } else if (v.sub_id === req.body.set_subjects.sub_id) {
              // if the database finds the result subject_id matchs with it, it will first delete the one from the database, then adds new one, and updates the database.
              let spread = [...result.subjects];
              // spread.splice(i, 1);
              spread.splice(i, 1);
              spread.push(req.body.set_subjects);
              // now checking for if they will be multiple
              let un_check = spread.filter(v => {
                return v.sub_id !== req.body.set_subjects.sub_id
              }) 
              let check = spread.filter(v => {
                return v.sub_id == req.body.set_subjects.sub_id
              })
              // now for removing the last in the array which is the correct one
              let check_pop = check.pop() 
  
              let fix_check = [...un_check, check_pop] 
              
  
              console.log(check)
              console.log(check_pop)
              console.log(fix_check)
  
              
              student_result_schema
                .findOneAndUpdate(
                  { _id: result._id },
                  { subjects: fix_check },
                  { new: true }
                )
                .then(saved_result => {
                  res.json({
                    result:
                      saved_result.subjects[saved_result.subjects.length - 1]
                        .scores
                  });
                })
                .catch(err =>
                  res.status(500).json({
                    Error: err,
                    Message:
                      "from found one and equal to the one you are bringing result subjects"
                  })
                );
            }
          });
          // return
        }
        return result;
      })
      .then(ok_pop => {
        // NOW for poosting the result total and average
        student_result_schema
          .findOne({ _id: req.params.resultID })
          .then(found_student_result => {
            const all_scores = found_student_result.subjects.map((v, i) => {
              return Object.keys(v.scores).map((a, b) => {
                return v.scores[a];
              });
            });
  
            // now this code brings out all the values that are inside array ARRAY and stores it in one  Array named empty_one
            let empty_one = [];
            all_scores.map(v => (empty_one = [...empty_one, ...v]));
  
            // now filtering out empty numbers ""
            let filter_space = empty_one.filter(v => v !== "");
  
            // now turning all the string numbers "3" to only numbers 3 for addition
            let integer_num = filter_space.map(v => +v);
  
            // now this fuction => fuction TOTAl will get the total of all the numbers in the array
  
            function TOTAl(integer_arrary) {
              let total = 0;
              for (i = 0; i < integer_arrary.length; i++) {
                total = total + integer_arrary[i];
              }
              return total;
            }
            // the student total
            let total = TOTAl(integer_num);
            // now getting the student average by getting the total subjects for the class
            class_subject.find({ classID: result.class_name_id }).then(found_sub => {
              let total_sub = found_sub.length;
              let average = total / total_sub;
              console.log(total)
              console.log(total)
              console.log(total)
              console.log(total)
              console.log(total)
              console.log(total)
              console.log(total)
              console.log(average)
              console.log(average)
              console.log(average)
              console.log(average)
              console.log(average)
              console.log(average)
              // res.json({ average, total });
              student_result_schema.findOneAndUpdate(
                { _id: found_student_result._id },
                { student_average: average, student_total: total },
                { new: true }
              )
              .then(saved_total_average => {
                res.status(201).json({student_average: saved_total_average.student_average, student_total: saved_total_average.student_total})
              })
            });
          });
      })
      .catch(err => res.status(500).json({ Error: err }));
  };
