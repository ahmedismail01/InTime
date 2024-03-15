const joi = require("joi");

module.exports = {
  register: {
    body: joi
      .object()
      .required()
      .empty()
      .keys({
        name: joi.string().required().empty().messages({
          "string.required": "please enter your name",
          "string.empty": "name cannot be empty",
        }),
        phone: joi.string().min(11).max(11).required().empty().messages({
          "string.required": "please enter your phone",
          "string.empty": "phone cannot be empty",
          "string.max": "phone number must be 11 numbers",
          "string.min": "phone number must be 11 numbers",
        }),
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .empty()
          .messages({
            "string.email": "please enter a valid email",
            "string.required": "please enter your email",
            "string.empty": "email cannot be empty",
          }),
        password: joi
          .string()
          .empty()
          .required()
          .pattern(
            new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
          )
          .messages({
            "string.required": "please enter your password",
            "string.base": "please enter a valid password",
            "string.empty": "password cannot be empty",
          }),
      }),
  },
  login: {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .empty()
          .messages({
            "string.email": "please enter a valid email",
            "string.required": "please enter your email",
            "string.empty": "email cannot be empty",
          }),
        password: joi.string().empty().required().messages({
          "string.required": "please enter your password",
          "string.empty": "password cannot be empty",
        }),
      }),
  },

  resetpassword: {
    body: joi
      .object()
      .required()
      .keys({
        password: joi
          .string()
          .empty()
          .pattern(
            new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
          )
          .required()
          .messages({
            "string.required": "please enter your password",
            "string.base": "please enter a valid password",
            "string.empty": "password cannot be empty",
          }),
        confirmPassword: joi
          .string()
          .empty()
          .valid(joi.ref("password"))
          .required()
          .messages({
            "string.required": "please enter your password",
            "string.empty": "password cannot be empty",
          }),
      }),
  },
  onlyEmailWanted: {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .empty()
          .messages({
            "string.email": "please enter a valid email",
            "string.required": "please enter your email",
            "string.empty": "email cannot be empty",
          }),
      }),
  },
};
