const express = require("express");
const router = express.Router();
const checkAuth = require("../../middleware/check-auth");
const teacher_student_controller = require("../../controllers/teacher/teacher_student");
const teacher_login_controller = require("../../controllers/teacher/teacher_login");
const student_result_controller = require("../../controllers/teacher/student_result");
const subject_performance_controller = require('../../controllers/teacher/subject_performance');
const handle_subject_controller = require('../../controllers/teacher/handle_result');
const performance_coanttroller = require('../../controllers/teacher/performance');
const fee_score_controller = require('../../controllers/teacher/fill_scores');
const teacher_class_controller = require('../../controllers/teacher/teacher_class');
const result_controller = require('../../controllers/teacher/result');
const fill_subject_controller = require('../../controllers/teacher/fill_subject');
const graduating_controller = require("../../controllers/teacher/graduating");

// Teacher LOGIN into the web
router.post("/login", teacher_login_controller.teacher_login);

// Teacher adding students
router.post("/students", checkAuth, teacher_student_controller.add_students);

// Teacher getting all students
router.get("/students", checkAuth, teacher_student_controller.get_all_student);

// Teacher getting each students
router.get(
  "/student/:id",
  checkAuth,
  teacher_student_controller.get_each_student
);

// Teacher updating each students Details
router.put(
  "/student/:id",
  checkAuth,
  teacher_student_controller.edit_student_details
);

// Teacher graduating student
router.put("/graduate/:id", checkAuth, graduating_controller.graduate);

// TEACHER GETING THE NEXT CLASS AND THE 
router.get("/graduating_list", checkAuth, teacher_class_controller.graduate_next_class)

// Teacher getting there students the handle_result
router.get(
  "/handle_students/:classID",
  checkAuth,
  teacher_student_controller.get_students_from_handle_result_array
);

//  Teacher Posting New Result Sheet
router.post("/student_result/:studentID", checkAuth, student_result_controller.post_new_result)

//  Teacher Getting available Result Sheet
router.get("/student_result/:studentID", checkAuth, student_result_controller.get_available_term)

//  Teacher Getting Each Result Sheet
router.get("/student_result/:resultID", checkAuth, student_result_controller.get_result_with_resultID)

// Teacher filling created subjects with scores subjects for only FORM teachers and for primary teachers
router.put("/fill_result/:resultID", checkAuth, fill_subject_controller.fill_subjects)

//Teacher getting selected subject value
router.get("/get_subject_value/:resultID/:subjectID", checkAuth, student_result_controller.get_subject_value)

// Teacher filling created subjects with scores subjects for only PART_TIME teachers and for or secondary teachers
router.get('/get_handle/:classID/:studentID/:subjectID', checkAuth, handle_subject_controller.get_handle_result)

//Teacher getting his or her class subjects
router.get("/subjects", checkAuth, subject_performance_controller.get_class_subject)

// Teacher posting his or her Student performance
router.put('/fill_performance/:resultID', checkAuth, performance_coanttroller.fill_performance)

// Teacher clearing his or her Student performance
router.put('/clear_performance/:resultID', checkAuth, performance_coanttroller.clear_performance)

// THIS IS TEACHER CHANGING THE TIMES SCHOOL_HELD AND NO. of PRESENT
router.put('/change_no_of_times/:resultID', checkAuth, performance_coanttroller.put_no_of_times)

// this is for getting all students current term result now if teacher have not created current tearm result, it automatically creates on its own
router.get("/fill_scores/:subjectID", checkAuth, fee_score_controller.get_all_student)

// teacher getting the school calendar
router.get('/calendar', checkAuth, teacher_class_controller.get_calendar);

// teacher changing his/ her password;
router.put('/update_password', checkAuth, teacher_login_controller.change_password);

// teacher updateing student result for the "form_teachers_comment" 
router.put("/form_teachers_comment/:resultID", checkAuth, result_controller.put_teachers_comment);

// teacher getting his/her  class fee_schedule for the term
router.get('/teacher_get_feeSchedule/:classID', checkAuth, teacher_class_controller.get_class_fee_schedule)






// this route is to bring the  other_required input of a child => the performace, the form teachers comment if any, and also show the total and the average of the student that wants the required input
router.get('/other_input/:resultID', checkAuth, result_controller.other_input)
// teacher gettingall the student result in the modal to send for approval
router.get('/result_for/:resultID', checkAuth, result_controller.get_this_result) 
// now teacher is true with the result, wants to send message to the management saying 'am through with this result ooo please approve it ooo'
router.post('/submitting_result/:resultID', checkAuth, subject_performance_controller.submittResult)


// this route is so that when Assigned Teacher logges in he/she sees total number of the students assigned to it 
router.get('/get_students_total', checkAuth, teacher_class_controller.get_studentsTotal)








module.exports = router;
