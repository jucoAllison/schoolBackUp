const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== undefined) {
    const authArray = authHeader.split(" ");
    const bearer = authArray[1];

    jwt.verify(
      bearer,
      "somespecialsecretkey!@#$%^&*()_+_)(*&^%$#@!",
      (err, resuilt) => {
        if (err) {
          res.sendStatus(403);
        }
        if (resuilt) {
          req.verify = resuilt;
          next();
        } else {
          res.sendStatus(403);
        }
      }
    );
  } else {
    res.sendStatus(403);
  }
};
