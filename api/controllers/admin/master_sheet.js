const term_schema = require("../../schema/admin/term_schema");
const year_schema = require("../../schema/admin/year_schema");
const student_schema = require("../../schema/teacher/student");
const student_result_shema = require("../../schema/teacher/student_result");
const class_subject_schema = require("../../schema/admin/class_subjects");

// admin getting the years of the school in order to select the term for the mastersheet
exports.get_years = (req, res) => {
  year_schema
    .find()
    .select("year")
    .then(found => {
      res.status(200).json({ result: found });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin getting list of terms in the selected year above
exports.get_terms_in_year = (req, res) => {
  term_schema
    .find({ year_id: req.params.yearID })
    .select("_id term year_id")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

//  admin getting the master_sheet for the selected class, year, and term
exports.get_master_sheet = (req, res) => {
  class_subject_schema
    .find({ classID: req.params.classID })
    .select("subjects")
    .then(found_subject => {
      let class_subject = found_subject
      student_result_shema
        .find({
          class_name_id: req.params.classID,
          year_id: req.params.yearID,
          term_id: req.params.termID
        })
        .select("full_name subjects student_total student_average")
        .then(found_all_student_result_schema => {
          student_schema
            .find({ class_name: req.params.classID })
            .select("full_name")
            .then(found_student => {
              let non_result_sheet = found_student.filter(  
                v =>
                  !found_all_student_result_schema.some(
                    b => v.full_name == b.full_name
                  )
              );
              let sort_decending_order = found_all_student_result_schema.sort((a,b) => b.student_total - a.student_total)
              let setting_student_total = found_all_student_result_schema.map(v => {
                let compound = sort_decending_order.map((s,i) =>{
                  if(s.student_total == v.student_total){
                    return i + 1
                  }
                })
                let check = compound.filter(v => v !== undefined)
                // // console.log(sort_decending_order)
                // console.log(check)
                return ({
                  full_name: v.full_name,
                  _id: v._id,
                  student_total: v.student_total,
                  student_position: check[0],
                  student_average: v.student_average,
                  subjects: v.subjects.map(w => {
                    return({
                      sub_name: w.sub_name,
                      total: +w.scores.assignment + +w.scores.test + +w.scores.mid_term + +w.scores.exams
                    })
                  })
                })
              })
              let join = [...non_result_sheet, ...setting_student_total]
              // res.status(200).json({ result: setting_student_total });
              res.status(200).json({ result: join, class_subject });
            })
            .catch(err => res.status(500).json({ Error: err }));
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};
