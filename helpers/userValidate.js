const Joi = require("joi");
const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).required(),
});

// Функция валидации тела запроса
function validateUserJoi(reqBody) {
  const { error, value } = schema.validate(reqBody);
  return { error, value };
}

module.exports = validateUserJoi;
