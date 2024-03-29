require("dotenv").config();
const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { HttpError } = require("../helpers");
const { sendActivationMail } = require("./mail-service.js");
const {
  generatedToken,
  saveRefreshToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
} = require("./token-service.js");
const createUserDto = require("../dtos/user-dto.js");

const SALT = 10;
const apiUrl = process.env.API_URL;

// Получить всех пользователей

const getAllUsersService = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {}
};

// Регистрация

const registrationService = async (email, password) => {
  // Проверяю есть ли в базе пользователь с таким email
  const candidate = await User.findOne({ email });
  // Если пользователь существует , прокидываю ошибку
  if (candidate) {
    throw HttpError(400, `User with this ${email} already exists`);
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

  await sendActivationMail(
    email,
    `${process.env.API_URL}/api/activate/${activationLink}`
  );

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
// Функция активации

const activateSevice = async (activationLink) => {
  const user = await User.findOne({ activationLink });
  if (!user) {
    throw HttpError(400, "Uncorrect activation link");
  }

  user.isActivated = true;

  await user.save();
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Erorr authorization");
  }

  const isPassEquals = await bcrypt.compare(password, user.password);
  if (!isPassEquals) {
    throw HttpError(400, "Erorr authorization");
  }
  const userDto = createUserDto(user);

  const tokens = generatedToken({ ...userDto });

  await saveRefreshToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};

const logoutService = async (refreshToken) => {
  const token = await removeToken(refreshToken);
  return token;
};
const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw HttpError(401, "User mathetr fuka dont fined");
  }
  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);
  console.log(userData);
  console.log(tokenFromDB);

  if (!userData || !tokenFromDB) {
    throw HttpError(401, "User dont fined");
  }
  const user = await User.findById(userData.id);
  const userDto = createUserDto(user);
  const tokens = generatedToken({ ...userDto });
  await saveRefreshToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};

module.exports = {
  registrationService,
  getAllUsersService,
  activateSevice,
  loginService,
  logoutService,
  refreshService,
};
