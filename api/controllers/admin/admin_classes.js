const mongoose = require("mongoose"),
  class_Schema = require("../../schema/admin/Classes"),
  class_subject = require("../../schema/admin/class_subjects"),
  class_performance = require("../../schema/admin/class_performance");

// POSTING NEW SUBJECTS for a particular class
exports.post_new_subjects = (req, res) => {
  class_Schema
    .findOne({ _id: req.params.classID })
    .then(foundClass => {
      let SUBJECTS = new class_subject({
        _id: mongoose.Types.ObjectId(),
        subjects: req.body.subject,
        classID: foundClass._id
      });
      SUBJECTS.save()
        .then(result => {
          res.status(201).json({ result });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// getting AlL SUBJECTS for a particular class
exports.get_all_class_subjects = (req, res) => {
  class_subject
    .find({ classID: req.params.classID })
    .select("subjects _id")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// POSTING NEW PeRFORmance for a particular class
exports.post_new_performance = (req, res) => {
  class_Schema
    .findOne({ _id: req.params.classID })
    .then(foundClass => {
      let PERFORMANCE = new class_performance({
        _id: mongoose.Types.ObjectId(),
        performance: req.body.performance,
        classID: foundClass._id
      });
      PERFORMANCE.save()
        .then(result => {
          res.status(200).json({ result });
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// getting AlL PERFORMANCE for a particular class
exports.get_all_class_performance = (req, res) => {
  class_performance
    .find({ classID: req.params.classID })
    .select("performance _id")
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// deleting any class subject if allow_access from admin is true
exports.delete_subjects = (req,res) => {
  let check = req.verify.allowAccess;
  if(check){
    class_subject.findOne({_id: req.params.subID})
    .then(foundSub => {
      if(!foundSub){
        res.status(200).json({Message: "No subject found"})
      }else{
        class_subject.findOneAndDelete({_id: foundSub._id})
        .then(deletedSub => {
          res.status(200).json({Message: "Subject Deleted", result: {_id: foundSub._id, subjects:foundSub.subjects}})
        })
        .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
  }else{
    return res.status(401).json({Message: "Can't delete subject, You have no access"})
  }
};

// deleting any class performance if allow_access from admin is true
exports.delete_performance = (req,res) => {
  let check = req.verify.allowAccess;
  if(check){
    class_performance.findOne({_id: req.params.perID})
    .then(foundSub => {
      if(!foundSub){
        res.status(200).json({Message: "No performance found"})
      }else{
        class_performance.findOneAndDelete({_id: foundSub._id})
        .then(deletedSub => {
          res.status(200).json({Message: "Performance Deleted", result: {_id: foundSub._id, performance:foundSub.performance}})
        })
        .catch(err => res.status(500).json({ Error: err }));
      }
    })
    .catch(err => res.status(500).json({ Error: err }));
  }else{
    return res.status(401).json({Message: "Can't delete performance, You have no access"})
  }
};
