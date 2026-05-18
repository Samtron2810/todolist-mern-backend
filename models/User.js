const mongoose = require("mongoose");

// Define how a user looks
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

// Create model from schema
const User = mongoose.model("User", userSchema);

// Export it so we can use it elsewhere
module.exports = User;
