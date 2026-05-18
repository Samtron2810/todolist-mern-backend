const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // for password hashing (optional but recommended)
const jwt = require("jsonwebtoken"); // for token generation (optional, not implemented in this example)

const User = require("../models/User"); // import user model

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Request received"); // ✅ check if route is hit
    console.log(req.body); // ✅ check incoming data

    // get data from frontend
    const { fullName, email, password } = req.body;

    //hash password (optional but recommended)
    //generate salt
    const salt = await bcrypt.genSalt(10);
    //hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      fullName,
      email,
      //save hashed password instead of plain text
      password: hashedPassword,
    });

    console.log("Saving user..."); // ✅ before DB save

    // save to database
    await user.save();

    console.log("User saved!"); // ✅ after save

    res.send("User created successfully");
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received");
    console.log(req.body);

    const { email, password } = req.body;

    // Find user with matching email AND password
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    //compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    // if password does not match
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    // If matched
    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,

      // token expires in 1 day
      {
        expiresIn: "1d",
      },
    );

    // send token + user
    res.send({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// export router;
module.exports = router;
