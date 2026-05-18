const mongoose = require("mongoose");

// Define structure of a todo
const todoSchema = new mongoose.Schema({
  userId: String, // ID of the user who created it
  text: String, // the task itself
});

// Create model
const Todo = mongoose.model("Todo", todoSchema);

// Export it
module.exports = Todo;
