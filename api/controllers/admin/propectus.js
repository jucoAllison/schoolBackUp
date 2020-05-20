const prospectus_header_schema = require("../../schema/admin/prospectus/prospectus_header"),
  mongoose = require("mongoose"),
  prospectus_schema = require('../../schema/admin/prospectus/prospectus'),
  requirement_schema = require('../../schema/admin/prospectus/requirement');

  
  // getting all the availble prospectus header
exports.get_prospectus_header = (req, res) => {
  prospectus_header_schema
    .find()
    .then(result => {
      if (result.length < 1) {
        res.status(200).json({
          Message: "There are no prospectus headers. Add headers to continue",
          result: [
            { _id: "", header: "" },
            { _id: "", header: "" }
          ]
        });
      }
      res.status(200).json({ result });
    })
    .catch(err => res.status(500).json({ Erro: err }));
};

// posting a new prospectus header
exports.post_prospectus_header = (req, res) => {
  let new_header = new prospectus_header_schema({
    _id: mongoose.Types.ObjectId(),
    header: req.body.header
  });
  new_header
    .save()
    .then(result => {
      res.status(201).json({ result: result });
    })
    .catch(err => res.status(500).json({ Erro: err }));
};

//  deleting any prospectus header
exports.delete_prospectus_header = (req, res) => {
  let check_access = req.verify.allowAccess;
  if (!check_access) {
    res
      .status(406)
      .json({ Message: "Can't perform this operation. You have no access" });
    return null;
  } else {
    prospectus_header_schema
      .findByIdAndDelete({ _id: req.params._id })
      .then(result => {
        res.status(200).json({ Message: "Ok" });
      })
      .catch(err => res.status(500).json({ Error: err }));
  }
};


// admin getting each class prospectus and setting up the Prospectus if the class do not have one
exports.get_prospectus_for_class = (req, res) => {
  prospectus_schema
    .findOne({ class_id: req.params.classID })
    .then(ok => {
      prospectus_header_schema
        .find()
        .select("_id header")
        .then(found_headers => {
          // if the gotten class do not have any prospectus posted already in other for the put to be functional, it has to post
          if (ok === null) {
            let new_post = new prospectus_schema({
              _id: mongoose.Types.ObjectId(),
              class_id: req.params.classID,
              prospectus: req.body.prospectus
            });
            new_post
              .save()
              .then(result => {
                // now after ever the selected class is now with a prospectus, we will now get the prospectus headers
                res.status(201).json({ result: result.prospectus, headers: found_headers });
              })
              .catch(err => res.status(500).json({ Error: err }));
          } else {
            res.status(200).json({ result: ok.prospectus, headers: found_headers });
          }
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};


// admin changing the already created prospectus
exports.put_prospectus_for_class = (req, res) => {
  prospectus_schema
    .findOne({ class_id: req.params.classID })
    .then(found_class => {
      prospectus_schema
        .findOneAndUpdate(
          { _id: found_class._id },
          { prospectus: req.body.prospectus },
          { new: true }
        )
        .then(result => {
          res.status(201).json({ result: result.prospectus });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};


// admin getting each class Requirement
exports.get_class_requirement = (req,res) => {
  requirement_schema.find({class_id: req.params.classID}).select("_id requirement")
  .then(found_requirement => {
    if(found_requirement.length < 1){
      res.status(200).json({Message: "No available requirements", result:[{_id: "", requirement: ""}]})
    }else{
      res.status(200).json({result: found_requirement})
    }
  })
  .catch(err => res.status(500).json({ Error: err }));
}
//  admin posting each class a new requirement
exports.post_class_requirement = (req,res) => {
  let new_requirement = new requirement_schema({
    _id: mongoose.Types.ObjectId(),
    requirement: req.body.requirement,
    class_id: req.params.classID
  })
  .save()
  .then(result => {
    res.status(200).json({result: {_id: result._id, requirement: result.requirement}})
  })
  .catch(err => res.status(500).json({ Error: err }));
}
//  admin deleting each class a new requirement
exports.delete_requirement = (req,res) => {
  requirement_schema.findOneAndDelete({_id: req.params._id})
  .then(result => {
    res.status(200).json({ Message: "Ok" });
  })
  .catch(err => res.status(500).json({ Error: err }));
}