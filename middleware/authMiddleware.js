const jwt = require("jsonwebtoken");

// middleware function
const authMiddleware = (req, res, next) => {
  try {
    // get authorization header
    const authHeader = req.headers.authorization;

    // check if token exists
    if (!authHeader) {
      return res.status(401).send("Access denied. No token provided.");
    }

    // remove "Bearer " from token
    const token = authHeader.split(" ")[1];

    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // save user info inside request
    req.user = verified;

    // continue to next function
    next();
  } catch (err) {
    console.log(err.message);

    res.status(401).send("Invalid or expired token");
  }
};

module.exports = authMiddleware;
