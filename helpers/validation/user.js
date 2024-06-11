const joi = require("joi");

module.exports = {
  updateUser: {
    body: joi
      .object()
      .required()
      .empty()
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
        title: joi.string(),
        about: joi.string(),
      }),
  },
  newPassword: {
    body: joi
      .object()
      .required()
      .keys({
        oldPassword: joi.string().empty().required().messages({
          "string.required": "please enter your password",
          "string.base": "please enter a valid password",
          "string.empty": "password cannot be empty",
          "object.regex":
            "min 8 letter password, with at least a symbol, upper and lower case letters and a number",
          "string.pattern.base":
            "password should contain : min 8 letters, with at least a symbol, upper and lower case letters and a number",
        }),
        newPassword: joi
          .string()
          .empty()
          .required()
          .disallow(joi.ref("oldPassword"))
          .pattern(
            new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
          )
          .messages({
            "string.required": "please enter your password",
            "string.base": "please enter a valid password",
            "string.empty": "password cannot be empty",
            "object.regex":
              "min 8 letter password, with at least a symbol, upper and lower case letters and a number",
            "string.pattern.base":
              "password should contain : min 8 letters, with at least a symbol, upper and lower case letters and a number",
          }),
        confirmPassword: joi
          .string()
          .empty()
          .valid(joi.ref("newPassword"))
          .required()
          .messages({
            "string.required": "please enter your password",
            "string.empty": "password cannot be empty",
            "any.only": "password must match",
          }),
      }),
  },
};
