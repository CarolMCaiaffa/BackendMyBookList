const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Book } = require("../models");


const emailRegexp = new RegExp(/^\S+@\S+\.\S+$/);
// validar la función de contraseña (6-12 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial)
const passwordRegexp = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,12}$/
);

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email y password son campos obligatorios",
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      message: "El nombre de usuaria debe tener al menos 3 caracteres",
    });
  }

  if (!emailRegexp.test(email)) {
    return res.status(400).json({ message: "Formato de email inválido" });
  }

  if (!passwordRegexp.test(password)) {
    return res.status(400).json({
      message:
        "Por favor revisa las indicaciones de la contraseña",
    });
  }

  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    console.log("userExists =>", userExists);
    if (userExists) {
      return res.status(400).json({ message: "Usuaria o email ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: "Usuaria registrada exitosamente",
      user: { username: username, email: email, _id: newUser._id },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      message: "username o email y password son campos obligatorios",
    });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuaria no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    req.session.user = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    res.status(200).json({
      message: "Usuaria inició sesión exitosamente",
      userId: user._id,
      user: { username: user.username, email: user.email, _id: user._id },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logOut = async (req, res) => {
  try {
    await req.session.destroy();
    res
      .status(200)
      .json({ message: "Session de usuaria cerrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id; 

  try {
    const user = await User.findById(userId).populate("books");

    if (!user) {
      return res.status(404).json({ message: "Usuaria no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Perfil de usuaria recuperado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({ message: "no se han encontrado usuarias" });
    }

    res
      .status(200)
      .json({ message: "Lista de usuarias recuperada exitosamente", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Usuaria actualizada exitosamente", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuaria no encontrado" });
    }

    await user.remove();
    res.status(200).json({ message: "Usuaria eliminada exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userMyBooks = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const books = await Book.find({ user: userId });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sessionChecker = (req, res, next) => {
  if (req.get("API-Key") === process.env.API_KEY) {
    req.session.user = {
      username: "API-User",
      email: " apiuser@api.com",
      _id: "api-user-id",
    };
    next();
  } else if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "No autorizado" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logOut,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  sessionChecker,
  userMyBooks,
};
