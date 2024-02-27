const { HttpError } = require("../helpers");
const { validateAccessToken } = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const authorizationHeaders = req.headers.authorization;
    if (!authorizationHeaders) {
      return next(HttpError(401, "Ошибка авторизации"));
    }

    const accessToken = authorizationHeaders.split(" ")[1];
    if (!accessToken) {
      return next(HttpError(401, "Ошибка авторизации"));
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      return next(HttpError(401, "Ошибка авторизации"));
    }
    req.user = userData;
    console.log(req.user);
    next();
  } catch (error) {
    return next(HttpError(401, "Нет доступа"));
  }
};
