const express = require("express");
const router = express.Router();

const usersController = require("./controllers/usersControllers");
const booksController = require("./controllers/booksControllers");
const session = usersController.sessionChecker;

router.post("/users/register", usersController.registerUser);
router.post("/users/login", usersController.loginUser);
router.get("/users/logout", usersController.logOut);
router.get("/users", session, usersController.getUsers);
router.get("/users/:id", session, usersController.getUser);
router.put("/users/:id", session, usersController.updateUser);
router.delete("/users/:id", session, usersController.deleteUser);
router.get("/user/myBooks", session, usersController.userMyBooks);

router.post("/books", session, booksController.createBook);
router.get("/books", session, booksController.getBooks);
router.get("/books/:id", session, booksController.getBookById);
router.put("/books/:id", session, booksController.updateBook);
router.delete("/books/:id", session, booksController.deleteBook);

module.exports = router;
