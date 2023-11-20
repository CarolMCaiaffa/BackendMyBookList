const { Book } = require("../models");

function isValidBookData(req, res) {
  const { title, author, genre, summary, year, rating } = req.body;

  if (
    !title ||
    !author ||
    !genre ||
    !summary ||
    !year ||
    (!rating && rating !== 0)
  ) {
    res.status(400).json({
      message:
        "Title, author, genre, summary, year, and rating son campos obligatorios",
    });
    return false;
  }

  if (!Number.isInteger(year) || !Number.isInteger(rating)) {
    res.status(400).json({
      message: "Año y Calificación deben ser números enteros",
    });
    return false;
  }

  if (year < 0 || year > new Date().getFullYear()) {
    res.status(400).json({
      message:
        "Año de libro inválido, debe ser mayor que 0 y menor o igual al año en curso",
    });
    return false;
  }

  if (rating < 0 || rating > 5) {
    res
      .status(400)
      .json({ message: "Calificación inválida, debe ser entre 0 y 5" });
    return false;
  }

  return true;
}

const createBook = async (req, res) => {
  try {
    if (!isValidBookData(req, res)) return;

    const { title, author, genre, summary, year, rating, user } = req.body;

    const newBookData = {
      title,
      author,
      genre,
      summary,
      year,
      rating,
      user: user || req.session.user._id,
    };

    const newBook = new Book(newBookData);

    await newBook.save();

    res
      .status(201)
      .json({ message: "Libro creado exitosamente", book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!isValidBookData(req, res)) return;

    const { _id } = req.body;

    if (_id !== req.params.id) {
      return res.status(400).json({ message: "Id de libro inválido" });
    }

    const bookId = req.params.id;
    const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: "Libro no encontrado o no autorizado" });
    }

    res.status(200).json({ message: "Libro actualizado", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findOneAndDelete({ _id: bookId });

    if (!deletedBook) {
      return res
        .status(404)
        .json({ message: "Libro no encontrado o no autorizado" });
    }

    res
      .status(204)
      .json({ message: "Libro eliminado exitosamente", _id: bookId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
