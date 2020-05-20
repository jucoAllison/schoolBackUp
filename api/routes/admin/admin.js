const express = require("express"),
  router = express.Router(),
  classSchema = require("../../schema/admin/Classes"),
  calendar = require("../../controllers/admin/calendar"),
  admin_teacher_controller = require("../../controllers/admin/admin_teacher"),
  admin_message_controller = require('../../controllers/admin/messages'),
  admin_student_controller = require('../../controllers/admin/admin_student'),
  admin_settings_controller = require('../../controllers/admin/admin_settings'),
  admin_class_controller = require('../../controllers/admin/admin_classes'),
  fee_schedule_controller = require('../../controllers/admin/fee_schedule'),
  prospectus_controller = require('../../controllers/admin/propectus'),
  anoucement_controller = require('../../controllers/admin/anoucement'),
  school_policy_controller = require('../../controllers/admin/school_policy'),
  approve_result_controller = require('../../controllers/admin/approve_result'),
  master_sheet_controller = require('../../controllers/admin/master_sheet'),
  admin_controller = require("../../controllers/admin/admin_admin"),
  checkAuth = require("../../middleware/check-auth");

// Everthing about route in Setting of Admin
// Everthing about route in Setting of Admin
// Everthing about route in Setting of Admin
// Everthing about route in Setting of Admin

//   MAnagement signing up another Management if YOur Allow Access is True
router.post("/creatNewAdmin", checkAuth, admin_settings_controller.create_new_admin);
//   MAnagement LOGIN
router.post("/login", admin_settings_controller.admin_login);
// Management UPDateing UserNAme
router.put("/putusername", checkAuth, admin_settings_controller.change_username);
// Management Updating Password
router.put("/putpassword", checkAuth, admin_settings_controller.change_password);

// management posting latest year
router.post('/latest_year', checkAuth, admin_settings_controller.post_latest_year);
// management posting latest term
router.post('/latest_term', checkAuth, admin_settings_controller.post_latest_term);
// management changing or updating his or her phone number
router.put("/update_phone", checkAuth, admin_settings_controller.update_phone_number);


// Everthing about admin and classes
// Everthing about admin and classes
// Everthing about admin and classes

// admin adding class
// router.post("/class", (req,res) => {
//   let classes = new classSchema({
//     _id: mongoose.Types.ObjectId(),
//     className: req.body.className
//   })
//   classes.save()
//   .then(result => {
//     res.status(201).json({result})
//   })
//   .catch(err => res.status(500).json({ Error: err }));
// })
// admin getting class
router.get("/class", checkAuth, (req, res) => {
  classSchema
    .find()
    .select("_id className")
    .then(result => res.status(200).json({ result }))
    .catch(err => res.status(500).json({ Error: err }));
});

// Everthing about sCHoOl CAlendAR
// Everthing about sCHoOl CAlendAR
// Everthing about sCHoOl CAlendAR

// POSTinG SchOoL Calendar
router.post("/schoolCalendar", checkAuth, calendar.post_cal);
// GETtINg SchOoL Calendar
router.get("/schoolCalendar", checkAuth, calendar.get_cal);
// delETting SchOoL Calendar
router.delete("/schoolCalendar/:id", checkAuth, calendar.delete_cal);


// Everthing about admin and Teacher
// Everthing about admin and Teacher
// Everthing about admin and Teacher

// admin adding new teacher
router.post("/teacher", checkAuth, admin_teacher_controller.new_teacher);
// admin getting all  teacher
router.get("/teacher", checkAuth, admin_teacher_controller.get_all_teacher);
// admin changing teachers details
router.put("/edit_teacher/:id", checkAuth, admin_teacher_controller.edit_teacher); 
// admin getting EACH each teacher
router.get("/each_teacher/:classId", checkAuth, admin_teacher_controller.get_each_teacher);
// admin getting EACH each teacher with teacherID
router.get("/each_teacherID/:id", checkAuth, admin_teacher_controller.get_each_teacher_with_id);
// admin assigning teacher class
router.put(
  "/teacher/:id",
  checkAuth,
  admin_teacher_controller.assign_teacher_class
  );
  // admin cleaning assgined class or changing back assign class to null
  router.put('/remove_assign/:id', checkAuth, admin_teacher_controller.remove_assign_teacher)
// admin deleting teacher
router.delete(
  "/teacher/:id",
  checkAuth,
  admin_teacher_controller.delete_class_teacher
);
// admin chaging teacher password
router.put(
  "/teacherpassword/:id",
  checkAuth,
  admin_teacher_controller.change_password
);
// admin putting handle ressult that is putting teachers in each class with its subjects. this is for secondary teachers with the teacherID
router.put("/put_handle_result/:teacherID", checkAuth, admin_teacher_controller.put_handle_result);
// admin removing or setting up the Handle_result Array lenght to 0 in order to remove partTime Teachers
router.put('/remove_handle_result/:teacherID', checkAuth, admin_teacher_controller.remove_handle_result)

// Everthing about admin and Message
// Everthing about admin and Message
// Everthing about admin and Message

// admin getting total Messages
router.get("/total/messages", checkAuth, admin_message_controller.get_total_messages);
// admin getting all Messages
router.get("/messages", checkAuth, admin_message_controller.get_all_messages);
// admin deleting any Message
router.delete("/messages/:id", checkAuth, admin_message_controller.delete_each_message);
// admin marking any clicked messages as read Message
router.put("/messages/:id", checkAuth, admin_message_controller.updateIsRead);

// Everthing about admin and students from any selected class
// Everthing about admin and students from any selected class
// Everthing about admin and students from any selected class

// getting total student in all school
router.get("/getstudents", checkAuth, admin_student_controller.get_all_students);
// getting all student in a class
router.get("/get_students/:classId", checkAuth, admin_student_controller.get_all_students_from_each_class);
// getting Each student from a class
router.get("/get_student/:eachId", checkAuth, admin_student_controller.get_each_student);
// changing gotten student details in a class
router.put("/get_student/:eachId", checkAuth, admin_student_controller.update_each_student_details);
// admin getting fullname login_id and passwords of student in a selected class 
router.get("/get_loginpass/:eachClass", checkAuth, admin_student_controller.get_loginID_with_password);
router.put("/change/:eachId", checkAuth, admin_student_controller.change_log_id_with_password);
// admin Deleting any student of chioce
router.delete("/Delete_this/:studentID", checkAuth, admin_student_controller.delte_this_Student);



// Everthing about admin and each class subjects and performance it contains get and post
// Everthing about admin and each class subjects and performance it contains get and post
// Everthing about admin and each class subjects and performance it contains get and post
// admin getting class subject for a selected class
router.get("/subjects/:classID", checkAuth, admin_class_controller.get_all_class_subjects);
// admin postting class subject for a selected class
router.post("/subjects/:classID", checkAuth, admin_class_controller.post_new_subjects);
// admin deletting class subject for a selected class
router.delete("/delete_subject/:subID", checkAuth, admin_class_controller.delete_subjects);
// admin getting all class performance for a selected class
router.get('/performance/:classID', checkAuth,admin_class_controller.get_all_class_performance);
// admin posting all class performance for a selected class
router.post('/performance/:classID', checkAuth,admin_class_controller.post_new_performance);
// admin deletting class performance for a selected class
router.delete("/delete_performance/:perID", checkAuth, admin_class_controller.delete_performance);

// Everthing about admin and fee_schedule
// Everthing about admin and fee_schedule
// Everthing about admin and fee_schedule
// management getting all fee_schedule_header
router.get("/fee_schedule", checkAuth, fee_schedule_controller.get_fee_schedule_header);
// management posting new fee_schedule_header
router.post("/fee_schedule", checkAuth, fee_schedule_controller.post_fee_schedule_header);
//  management deleting any selected header if the allow access  is true for the management
router.delete('/fee_schedule/:_id', checkAuth, fee_schedule_controller.delete_fee_schedule_header);

// management getting each class fee schedule
router.get('/main_fee_schedule/:classID', checkAuth, fee_schedule_controller.get_fee_schedule_for_class);
// management updating each class fee schedule
router.put('/main_fee_schedule/:classID', checkAuth, fee_schedule_controller.put_fee_schedule_for_class);


// Everthing about admin and prospectus
// Everthing about admin and prospectus
// Everthing about admin and prospectus
// management getting all prospectus_header
router.get("/prospectus", checkAuth, prospectus_controller.get_prospectus_header);
// management posting new prospectus_header
router.post("/prospectus", checkAuth, prospectus_controller.post_prospectus_header);
//  management deleting any selected header if the allow access  is true for the management
router.delete('/prospectus/:_id', checkAuth, prospectus_controller.delete_prospectus_header);

// management getting each class Prospectus
router.get('/main_prospectus/:classID', checkAuth, prospectus_controller.get_prospectus_for_class);
// management updating each class prospectus
router.put('/main_prospectus/:classID', checkAuth, prospectus_controller.put_prospectus_for_class);
// management getting eachClass Requirement
router.get('/requirement/:classID', checkAuth, prospectus_controller.get_class_requirement);
// management posting eachClass Requirement
router.post('/requirement/:classID', checkAuth, prospectus_controller.post_class_requirement);
// management deleting eachClass Requirement
router.delete('/requirement/:_id', checkAuth, prospectus_controller.delete_requirement);



// Everthing about admin and anouncment
// Everthing about admin and anouncment
// Everthing about admin and anouncment
// management getting all teachers contacts // that is if admin selects teacher to send message to
router.get('/anoucement/Teachers', checkAuth, anoucement_controller.get_all_teacher_contacts);
// management getting all parents with there emergency contacts contacts // that is if admin selects parents to send message to
router.get('/anoucement/Parents', checkAuth, anoucement_controller.get_all_parents_contacts);
// management getting all contacts teacher and parents
router.get('/anoucement/Both', checkAuth, anoucement_controller.get_all_contacts);



// Everthing about admin and school policy
// Everthing about admin and school policy
// Everthing about admin and school policy
// management getting school policy
router.get('/school_policy', checkAuth, school_policy_controller.get_school_policy);
// management putting school schedule
router.put('/school_policy/:_id', checkAuth, school_policy_controller.put_school_policy);



// Everthing about admin and approved result
// Everthing about admin and approved result
// Everthing about admin and approved result
// management getting all availble terms for the current year
router.get('/avialble_term', checkAuth, approve_result_controller.get_terms);
// management getting all student with the selected class and term
router.get('/avialble_term/:classID/:termID', checkAuth, approve_result_controller.get_all_result_for_approval);
// management now trying to change the main result (i.e. management posting the fields for fees_owing, fees_paid and principals result)
router.put('/complete_result/:resultID', checkAuth, approve_result_controller.put_remaining_result)
// management approving result
router.put('/approve_result/:resultID', checkAuth, approve_result_controller.approve_result)




// Everthing about admin and approved result
// Everthing about admin and approved result
// Everthing about admin and approved result
// management getting all availble terms for the current year
router.get('/avialble_term', checkAuth, approve_result_controller.get_terms);
// management getting all student with the selected class and term
router.get('/avialble_term/:classID/:termID', checkAuth, approve_result_controller.get_all_result_for_approval);




// Everthing about admin and MASTER_SHEET
// Everthing about admin and MASTER_SHEET
// Everthing about admin and MASTER_SHEET
// management getting all availble years
router.get('/avialble_year', checkAuth, master_sheet_controller.get_years);
// // management getting all aviable terms in the selected year
router.get('/aviable_term_in_year/:yearID', checkAuth, master_sheet_controller.get_terms_in_year)
//  management getting the selected class and selected year and selected term master sheet
router.get('/get_master_sheet/:classID/:yearID/:termID', checkAuth, master_sheet_controller.get_master_sheet)



// Everthing about admin and Management Controller
// Everthing about admin and Management Controller
// Everthing about admin and Management Controller

// admin getting all  teacher
router.get("/management_controller", checkAuth, admin_controller.get_all_management);
// management changing allow_access of a selected admin
router.put("/management_controller/:_id", checkAuth, admin_controller.change_access);
// management deleting any other management if only the allowAccess is true
router.delete("/management_controller/:_id", checkAuth, admin_controller.delete_admin); 


// Everthing about admin forgetting his or her password
// Everthing about admin forgetting his or her password
// Everthing about admin forgetting his or her password

router.post("/forgotten_password", admin_controller.forgotten_password);
// mangement now changing the password
router.post("/update_forgotten_password/:ID", admin_controller.change_password);


module.exports = router;
