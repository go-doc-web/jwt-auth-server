require("dotenv").config();
const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { sendActivationMail } = require("./mail-service.js");
const { generatedToken, saveRefreshToken } = require("./token-service.js");
const createUserDto = require("../dtos/user-dto.js");

const SALT = 10;
const apiUrl = process.env.API_URL;

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
  //!не работает разобраться позже
  await sendActivationMail(email, `${apiUrl}/api/activate/${activationLink}`);

  const userDto = createUserDto(newUser);

  // Генерируем токены, в качестве payload в функцию generatedToken передаем dto,
  // измененный щбьект модели пользователя, где убраны ненужные поля
  const { accessToken, refreshToken } = generatedToken(userDto);

  await saveRefreshToken(userDto.id, refreshToken);
  return {
    accessToken,
    refreshToken,
    user: userDto,
  };
};

module.exports = {
  registration,
  getAllUsers,
};
