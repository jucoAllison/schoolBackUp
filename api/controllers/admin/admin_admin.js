const admin_schema = require("../../schema/admin/adminLogin");

exports.get_all_management = (req, res) => {
  admin_schema
    .find()
    .select("_id username allowAccess main_admin")
    .then(result => {
      let total = result.length;
      res.status(200).json({ result, total });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin or management changing another management allow access if only his or her allow access is true
exports.change_access = (req, res) => {
  admin_schema
    .findOne({ _id: req.params._id })
    .then(result => {
      admin_schema
        .findOneAndUpdate(
          { _id: result._id },
          { allowAccess: !result.allowAccess },
          { new: true }
        )
        .then(getting_all => {
          admin_schema
            .find()
            .select("_id username allowAccess main_admin")
            .then(all => {
              let total = all.length;
              res.status(200).json({ result: all });
            })
            .catch(err => res.status(500).json({ Error: err }));
        })
        .catch(err => res.status(500).json({ Error: err }));
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// admin or management deleting another admin only if the allowAccess is true
exports.delete_admin = (req, res) => {
  admin_schema
    .findOneAndDelete({ _id: req.params._id })
    .then(deleted => {
      admin_schema
        .find()
        .select("_id username allowAccess main_admin")
        .then(found => {
          res.status(200).json({ result: found, total: found.length });
        });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// management forgeting his or password
exports.forgotten_password = (req, res) => {
  if (req.body.which == "USERNAME") {
    admin_schema
      .findOne({ username: req.body.payload.toLowerCase() })
      .then(found => {
        if (!found) {
          res
            .status(404)
            .json({
              Message: "Check the User_Name and try again",
              allowAccess: "found.allowAccess",
              _id: "found._id",
              phone: " found.phone"
            });
        } else {
          // res.status(200).json({ found });
          if (found.allowAccess) {
            let last_three_numbers = found.phone.toString().split("");
            res.status(200).json({
              Message: `${found.username}, should we send your new login details to this phone_number * * * * * * * * * ${last_three_numbers[9]} ${last_three_numbers[10]} ${last_three_numbers[11]} ${last_three_numbers[12]} `,
              allowAccess: found.allowAccess,
              _id: found._id,
              phone: found.phone
            });
          } else {
            res.status(200).json({
              Message: `${found.username}, please ask the management to generate a new login details for you`,
              allowAccess: found.allowAccess,
              _id: found._id,
              phone: found.phone
            });
          }
        }
      })
      .catch(err => res.status(500).json({ Error: err }));
  } else if (req.body.which == "NUMBER") {
    admin_schema
      .findOne({ phone: +req.body.payload })
      .then(found => {
        if (!found) {
          res
            .status(404)
            .json({
              Message: "Check the Number and try again",
              allowAccess: "found.allowAccess",
              _id: "found._id",
              phone: " found.phone"
            });
        } else {
          if (found.allowAccess) {
            let last_three_numbers = found.phone.toString().split("");
            res.status(200).json({
              Message: `${found.username}, should we send your new login details to this phone_number * * * * * * * * * ${last_three_numbers[9]} ${last_three_numbers[10]} ${last_three_numbers[11]} ${last_three_numbers[12]} `,
              allowAccess: found.allowAccess,
              _id: found._id,
              phone: found.phone
            });
          } else {
            res.status(200).json({
              Message: `${found.username},  please ask the management to generate a new login details for you`,
              allowAccess: found.allowAccess,
              _id: found._id,
              phone: found.phone
            });
          }
        }
      })
      .catch(err => res.status(500).json({ Error: err }));
  }
};

// admin submitting the newly password generated from forgotten password
exports.change_password= (req, res)=>{
  admin_schema.findOne({_id: req.params.ID})
  .then( found=> {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ Error: err });
      } else {
        adminLogin
          .findOneAndUpdate(
            { _id: found._id },
            { password: hash },
            { new: true }
          )
          .then(changeSuccess => {
            res.status(201).json({
              Message:
                "Password Changed Successfully. Use it next time"
            });
          })
          .catch(err => res.status(500).json({ err }));
      }
    });
  })
  .catch(err => res.status(500).json({ Error: err }));
}