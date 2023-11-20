const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  summary: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 }, //tiene un valor mínimo de 0 y un máximo de 5.
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Book: mongoose.model("Book", bookSchema),
};
