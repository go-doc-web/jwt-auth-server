require("dotenv").config();
const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { sendActivationMail } = "../service/mail-service.js";

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
const registration = async (email, password) => {
  // Проверяю есть ли в базе пользователь с таким email
  const candidate = await User.findOne({ email });
  // Если пользователь существует , прокидываю ошибку
  if (candidate) {
    throw new Error(`User with this ${email} already exists`);
  }
  // Если Пользователь с таким Email отсутствует, создаю нового
  // Использую bcrypt для хеширования пароля
  const SALT = 10;
  const hashPassword = await bcrypt.hash(password, SALT);
  // uuid.v4() для создания рандомной строки ссылки активации
  const activationLink = uuid.v4();
  // Create new User
  const newUser = await User.create({
    email,
    password: hashPassword,
    activationLink,
  });
  // call sendActivationMail Функция для отпраки ссылки на почту пользователя
  await sendActivationMail(email, activationLink);

  return newUser;
};

module.exports = {
  registration,
  getAllUsers,
};
