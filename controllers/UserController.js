const User = require("../models/user-model.js");
const { controllerWraper } = require("../utils");

const getUsers = async (req, res, next) => {
  const data = await User.find();
  res.status(200).json(data);
};
const registraition = async (req, res, next) => {};
const login = async (req, res, next) => {};
const logout = async (req, res, next) => {};
const activate = async (req, res, next) => {};
const refresh = async (req, res, next) => {};

module.exports = {
  getUsers: controllerWraper(getUsers),
  registraition: controllerWraper(registraition),
  login: controllerWraper(login),
  logout: controllerWraper(logout),
  activate: controllerWraper(activate),
  refresh: controllerWraper(refresh),
};
