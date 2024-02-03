const User = require("../models/user-model.js");

const registration = async (email, password) => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new Error(`User with this ${email} already exists`);
  }
  const user = await User.create({ email, password });
};

module.exports = {
  registration,
};
