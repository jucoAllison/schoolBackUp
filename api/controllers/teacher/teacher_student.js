const student_schema = require("../../schema/teacher/student"),
  admin_message = require("../../schema/admin/messages"),
  mongoose = require("mongoose");

exports.add_students = (req, res) => {
  let class_name = req.verify.class_name;
  if (class_name === "No Class") {
    return res.status(400).json({ Message: "You can't Add New Student" });
  } else {
    let student_details = new student_schema({
      _id: mongoose.Types.ObjectId(),
      class_name: req.verify.assignClass,
      full_name: req.body.full_name,
      age: req.body.age,
      sex: req.body.sex,
      phone: req.body.phone,
      address: req.body.address,
      parents_name: req.body.parents_name,
      parents_occupation: req.body.jsonparents_occupation,
      religion: req.body.religion,
      church: req.body.church,
      emergency_name: req.body.emergency_name,
      emergency_phone: req.body.emergency_phone,
      emergency_address: req.body.emergency_address,
      emergency_relationship: req.body.emergency_relationship,

      // new
      state_of_origin: req.body.state_of_origin,
      lga: req.body.lga,
      dob: req.body.dob
    });
    student_details
      .save()
      .then(result => {
        // sending Message to Admin
        let Admin_Message = new admin_message({
          _id: mongoose.Types.ObjectId(),
          message: `A new student has been registered to ${class_name}. ${req.body.full_name.toUpperCase()} `
        });
        Admin_Message.save()
          .then(message => {
            res.status(201).json({ result });
          })
          .catch(err =>
            res.status(500).json({
              Message: "Can'\t send the message to admin_message",
              Error: err
            })
          );
      })
      .catch(err => {
        res.status(500).json({ Error: err });
      });
  }
};

// Teacher getting all students
exports.get_all_student = (req, res) => {
  let class_name = req.verify.class_name;
  let assignClass = req.verify.assignClass;
  if (class_name == "No Class") {
    return res.status(409).json({ Message: "You are not assigned any class" });
  } else {
    student_schema
      .find({ class_name: assignClass })
      .select("full_name sex id")
      .then(result => {
        if (result.length > 0) {
          let total = result.length;
          res.status(200).json({ result, total });
        } else if (result.length === 0) {
          res
            .status(200)
            .json({ Message: "You have no Student. Add Students to continue" });
        }
      })
      .catch(err => {
        res.status(500).json({ Error: err });
      });
  }
};

// Teacher getting each student
exports.get_each_student = (req, res) => {
  student_schema
    .findOne({ _id: req.params.id })
    .select(
      "full_name age sex phone address parents_name parents_occupation religion church emergency_name emergency_phone emergency_address emergency_relationship state_of_origin lga dob"
    )
    .then(result => {
      res.status(200).json({
        result: {
          full_name: result.full_name || "",
          age: result.age || "",
          sex: result.sex || "",
          phone: result.phone || "",
          address: result.address || "",
          parents_name: result.parents_name || "",
          parents_occupation: result.parents_occupation || "",
          religion: result.religion || "",
          church: result.church || "",
          emergency_name: result.emergency_name || "",
          emergency_phone: result.emergency_phone || "",
          emergency_address: result.emergency_address || "",
          emergency_relationship: result.emergency_relationship || "",
          state_of_origin: result.state_of_origin || "",
          lga: result.lga || "",
          dob: result.dob || ""
        }
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "kjhgggui" });
    });
};

// Teacher updating students Details
exports.edit_student_details = (req, res) => {
  student_schema
    .findOne({ _id: req.params.id })
    .then(result => {
      let Verify = {
        full_name: result.full_name || req.body.full_name,
        parents_name: result.parents_name || req.body.parents_name,
        parents_occupation:
          result.parents_occupation || req.body.parents_occupation,
        church: result.church || req.body.church,
        sex: result.sex || req.body.sex,
        address: result.address || req.body.address,
        age: result.age || req.body.age,
        religion: result.religion || req.body.religion,
        phone: result.phone || req.body.phone,
        state_of_origin: result.state_of_origin || req.body.state_of_origin,
        emergency_name: result.emergency_name || req.body.emergency_name,
        emergency_phone: result.emergency_phone || req.body.emergency_phone,
        emergency_relationship:
          result.emergency_relationship || req.body.emergency_relationship,
        emergency_address:
          result.emergency_address || req.body.emergency_address,
        lga: result.lga || req.body.lga,
        dob: result.dob || req.body.dob
      };

      student_schema
        .findOneAndUpdate(
          { _id: result._id },
          {
            full_name: Verify.full_name,
            age: Verify.age,
            sex: Verify.sex,
            phone: Verify.phone,
            address: Verify.address,
            parents_name: Verify.parents_name,
            parents_occupation: Verify.parents_occupation,
            religion: Verify.religion,
            church: Verify.church,
            emergency_name: Verify.emergency_name,
            emergency_phone: Verify.emergency_phone,
            emergency_address: Verify.emergency_address,
            emergency_relationship: Verify.emergency_relationship,

            // new

            state_of_origin: Verify.state_of_origin,
            lga: Verify.lga,
            dob: Verify.dob
          },
          { new: true }
        )
        .then(change => {
          res.status(200).json({ result: change });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};

// teacher getting selected students this route is for the teacher that has handle_result Array for Secondary School
exports.get_students_from_handle_result_array = (req, res) => {
  student_schema
    .find({ class_name: req.params.classID })
    .select("full_name sex id")
    .then(result => {
      if (result.length > 0) {
        let total = result.length;
        res.status(200).json({ result, total });
      } else if (result.length === 0) {
        res.status(200).json({
          Message:
            "There are no student's in this class. Ask the Form Teacher to add students. ",
          total: 0
        });
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
};
