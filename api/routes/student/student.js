const express = require("express");
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');
const student_login_controller = require("../../controllers/student/student_login");
const student_result_controller = require('../../controllers/student/student_result')

// student logging in to his/her student PORTAL
router.post("/login", student_login_controller.student_login);

// student changing or setting up new password 
router.put("/update_password", checkAuth, student_login_controller.update_password)

// student getting each result after selecting the year and Term
router.get('/get_result_for/:yearID/:termID', checkAuth, student_result_controller.get_result)

module.exports = router;