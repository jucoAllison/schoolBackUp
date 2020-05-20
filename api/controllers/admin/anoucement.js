const teacher_schema = require("../../schema/admin/addTeacher"),
  student_schema = require("../../schema/teacher/student");

// getting all teachers contacts in other to send messages to them
exports.get_all_teacher_contacts = (req, res) => {
  teacher_schema
    .find()
    .select("phone _id")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// getting all parents phone numbers with there emergency contacts
exports.get_all_parents_contacts = (req, res) => {
  student_schema
    .find()
    .select("phone emergency_phone _id")
    .then(found => {
      res.status(200).json({ result: found });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// getting all numbers whether parents and teachers
exports.get_all_contacts = (req, res) => {
  teacher_schema
    .find()
    .select("phone _id")
    .then(found_teacher => {
      // res.status(200).json({ result });
      student_schema
        .find()
        .select("phone emergency_phone _id")
        .then(found_parents => {
          res.status(200).json({ result: [...found_teacher, ...found_parents] });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
