const class_schema = require("../../schema/admin/Classes"),
  bcrypt = require("bcrypt"),
  student_schema = require("../../schema/teacher/student"),
  student_result_shema = require('../../schema/teacher/student_result');

//admin getting all student in school
exports.get_all_students = (req, res) => {
  student_schema
    .find()
    .then(result => {
      res.status(200).json({ result: result.length });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin getting each student from each selected class
exports.get_all_students_from_each_class = (req, res) => {
  class_schema
    .findOne({ _id: req.params.classId })
    .then(found_class => {
      student_schema
        .find({ class_name: found_class._id })
        .select("full_name sex _id")
        .then(result => {
          res.status(200).json({
            class_name: found_class.className,
            total: result.length,
            result
          });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

//admin getting each student from the selected class
exports.get_each_student = (req, res) => {
  student_schema
    .findOne({ _id: req.params.eachId })
    .select(
      "full_name age sex phone address parents_name parents_occupation religion church emergency_name emergency_phone emergency_address emergency_relationship state_of_origin lga dob"
    )
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin changing any student details
exports.update_each_student_details = (req, res) => {
  student_schema
    .findOne({ _id: req.params.eachId })
    .then(result => {
      let verify = {
        verifyFullname: req.body.full_name || result.full_name,
        verifyAge: req.body.age || result.age,
        verifySex: req.body.sex || result.sex,
        verifyPhone: req.body.phone || result.phone,
        verifyAddress: req.body.address || result.address,
        verifyParents_name: req.body.parents_name || result.parents_name,
        verifyParents_occupation:
          req.body.parents_occupation || result.parents_occupation,
        verifyReligion: req.body.religion || result.religion,
        verifyChurch: req.body.church || result.church,
        verifyEmergency_name: req.body.emergency_name || result.emergency_name,
        verifyEmergency_phone:
          req.body.emergency_phone || result.emergency_phone,
        verifyEmergency_address:
          req.body.emergency_address || result.emergency_address,
        verifyEmergency_relationship:
          req.body.emergency_relationship || result.emergency_relationship,
        // New
        verifyState_of_origin:
          req.body.state_of_origin || result.state_of_origin,
        verifyLga: req.body.lga || result.lga,
        verifyDob: req.body.dob || result.dob
      };
      student_schema
        .findOneAndUpdate(
          { _id: result._id },
          {
            full_name: verify.verifyFullname,
            age: verify.verifyAge,
            sex: verify.verifySex,
            phone: verify.verifyPhone,
            address: verify.verifyAddress,
            parents_name: verify.verifyParents_name,
            parents_occupation: verify.verifyParents_occupation,
            religion: verify.verifyReligion,
            church: verify.verifyChurch,
            emergency_name: verify.verifyEmergency_name,
            emergency_phone: verify.verifyEmergency_phone,
            emergency_address: verify.verifyEmergency_address,
            emergency_relationship: verify.verifyEmergency_relationship,
            // new_once
            state_of_origin: verify.verifyState_of_origin,
            lga: verify.verifyLga,
            dob: verify.verifyDob
          },
          { new: true }
        )
        .then(result => {
          res.status(200).json({ result });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// Everything about admin and generate scrach card
// Everything about admin and generate scrach card
// Everything about admin and generate scrach card
// Everything about admin and generate scrach card
// Everything about admin and generate scrach card

// admin getting loginID and password
exports.get_loginID_with_password = (req, res) => {
  class_schema
    .findOne({ _id: req.params.eachClass })
    .then(found_class => {
      student_schema
        .find({ class_name: found_class._id })
        .select("full_name _id log_id access")
        .then(result => {
          res.status(200).json({ result });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin changing selected class loginId and password in other to generate scrach card
exports.change_log_id_with_password = (req, res) => {
  bcrypt.hash(req.body._uuid, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ Message: "Error from hasing", Error: err });
    } else {
      student_schema
        .findOneAndUpdate(
          { _id: req.params.eachId },
          { log_id: req.body._uuid, password: hash, access: req.body._uuid }
        )
        .then(result => {
          res.status(200).json({
            Message: "loginID and password changed successfully"
          });
        })
        .catch(err => res.status(500).json({ Error: err }));
    }
  });
};

// admin delteing anny sttudent of chioce
exports.delte_this_Student = (req, res) => {
  student_schema
    .find({ _id: req.params.studentID })
    .then(found_student => {
      student_schema.findOneAndDelete({_id: found_student._id})
      .then(Deleted => {
        res.status(201).json({Message: found_student})
      })
    })
    .catch(err => res.status(500).json({ Error: err }));
};
