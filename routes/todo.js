const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // import auth middleware

const Todo = require("../models/Todo"); // import todo model

// Create a new todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Create todo request");
    console.log(req.body);

    const { userId, text } = req.body;

    const todo = new Todo({
      userId,
      text,
    });

    await todo.save(); //save todo to database

    res.send({
      message: "Todo created successfully",
      todo: todo,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// Get all todos for a user
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.params.userId, // find todos by userId
    });

    res.send(todos);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// delete todo by id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Delete request received for id:", req.params.id);

    // find and delete the todo by id
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).send("Todo not found");
    }

    res.send({
      message: "Todo deleted successfully",
      todo: deletedTodo,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// edit todo by id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Edit request received for id:", req.params.id);

    //get new text from request body (from frontend)
    const { text } = req.body;

    // find the todo by id and update its text
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: text },
      { new: true }, // return the updated document
    );

    res.send(updatedTodo);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
