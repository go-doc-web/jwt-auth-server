require("dotenv").config();
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model.js");

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const generatedToken = (payload) => {
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "30d" });

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  const refreshTokenData = await tokenModel.findOne({ user: userId });
  if (refreshTokenData) {
    refreshTokenData.refreshToken = refreshToken;
    refreshTokenData.save();
  }

  const token = await tokenModel.create({ user: userId, refreshToken });
  return token;
};

module.exports = {
  generatedToken,
  saveRefreshToken,
};
