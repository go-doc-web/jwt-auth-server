require("dotenv").config();
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model.js");

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const generatedToken = (payload) => {
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "60s" });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "30d" });

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  const refreshTokenData = await tokenModel.findOne({ user: userId });
  if (refreshTokenData) {
    refreshTokenData.refreshToken = refreshToken;
    return refreshTokenData.save();
  }

  const token = await tokenModel.create({ user: userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  const tokenData = await tokenModel.deleteOne({ refreshToken });
  return tokenData;
};
const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, accessSecret);
    return userData;
  } catch (error) {
    return null;
  }
};
const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

const findToken = async (refreshToken) => {
  const tokenData = await tokenModel.findOne({ refreshToken });

  return tokenData;
};

module.exports = {
  generatedToken,
  saveRefreshToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
