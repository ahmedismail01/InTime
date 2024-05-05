const joi = require("joi");

module.exports = {
  updateUser: {
    body: joi
      .object()
      .required()
      .keys({
        name: joi.string().empty().messages({
          "string.required": "please enter your name",
          "string.empty": "name cannot be empty",
        }),
        phone: joi.string().min(11).max(11).empty().messages({
          "string.empty": "phone cannot be empty",
          "string.max": "phone number must be 11 numbers",
          "string.min": "phone number must be 11 numbers",
        }),
        age: joi.number().messages({
          "number.integer": "please enter a valid age",
        }),
      }),
  },
};
