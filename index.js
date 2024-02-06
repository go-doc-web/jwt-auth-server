require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev")); // combined
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server found" } = err;
  res.status(status).json({ message });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST).then(() => {
      console.log("Database connection successful");
    });

    app.listen(PORT, () => {
      console.log(`Server run on the ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();

// THGqMwMonASRcdmv
