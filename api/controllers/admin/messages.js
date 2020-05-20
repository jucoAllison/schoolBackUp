const message_schema = require("../../schema/admin/messages");

//getting total messages
exports.get_total_messages = (req,res) => {
  message_schema.find()
  .then(result => {
    res.status(200).json({result: result.length})
  })
  .catch(err => res.status(500).json({ Error: err }));
}

// getting all messages
exports.get_all_messages = (req, res) => {
  message_schema
    .find()
    .select("_id message isRead")
    .then(result => res.status(200).json({ result }))
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};

// deleting any messages
exports.delete_each_message = (req, res) => {
  message_schema
    .findOneAndDelete({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ Message: "Teacher Deleted Successfully" });
    })
    .catch(err => res.status(500).json({ Error: err }));
};

// updating isRead when clicked any messages
exports.updateIsRead = (req, res) => {
  message_schema
    .findOneAndUpdate({ _id: req.params.id }, { isRead: true }, { new: true })
    .then(result => {
      res.status(200).json({ Message: "isRead updted successfully" });
    })
    .catch(err => res.status(500).json({ Error: err }));
};
