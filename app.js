const express = require("express");
const mongoose = require("mongoose");
const routes = require("./server/routes");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});

sessionStore.on("error", function (error) {
  console.error("Error al conectar a session store:", error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGINS.split(","),
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      path: "/api",
      httpOnly: true,
      secure: !process.env.CORS_SECURE === "false",
      sameSite: false,
      rolling: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    saveUninitialized: false,
    store: sessionStore,
    SameSite: process.env.CORS_SAME_SITE,
  })
);

app.use("/api", routes);

module.exports = app;
