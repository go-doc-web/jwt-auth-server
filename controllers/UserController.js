require("dotenv").config();
const User = require("../models/user-model.js");

const { controllerWraper } = require("../utils");
const {
  registrationService,
  getAllUsersService,
  activateSevice,
  loginService,
} = require("../service/user-service.js");

const { validateUserJoi } = require("../helpers");

// GET Users

const getUsers = async (req, res, next) => {
  const data = await getAllUsersService();
  res.status(200).json(data);
};

// Registration

const registraition = async (req, res, next) => {
  const { error } = validateUserJoi(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  const data = await registrationService(email, password);
  // Отправляем токен в куках httpOnly: true обязателен, если протокол секур - говорим
  // об єтом в опциях
  res.cookie("refreshToken", data.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json(data);
};

// Login

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const data = await loginService(email, password);
  res.cookie("refreshToken", data.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json(data);
};

// Logout

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  res.send({ message: "logot", token: refreshToken });
};

const activate = async (req, res, next) => {
  const activationLink = req.params.link;
  await activateSevice(activationLink);

  res.status(302).redirect(process.env.CLIENT_URL || `http://localhost:3000`);
};
const refresh = async (req, res, next) => {};

module.exports = {
  getUsers: controllerWraper(getUsers),
  registraition: controllerWraper(registraition),
  login: controllerWraper(login),
  logout: controllerWraper(logout),
  activate: controllerWraper(activate),
  refresh: controllerWraper(refresh),
};
