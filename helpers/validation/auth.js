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
        phone: joi.string().required().messages({
          "string.required": "please enter your phone",
          "string.empty": "phone cannot be empty",
          "string.pattern.base": "phone number must be 11 numbers",
        }),
        email: joi
          .string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "eg"] },
          })
          .empty()
          .required()
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
      }),
  },
  login: {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "eg"] },
          })
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
          .required()
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
          .valid(joi.ref("password"))
          .required()
          .messages({
            "string.required": "please enter your password",
            "string.empty": "password cannot be empty",
            "any.only": "password must match",
          }),
        email: joi
          .string()
          .required()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "eg"] },
          })
          .empty()
          .messages({
            "string.email": "please enter a valid email",
            "string.required": "please enter your email",
            "string.empty": "email cannot be empty",
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
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "eg"] },
          })
          .empty()
          .messages({
            "string.email": "please enter a valid email",
            "string.required": "please enter your email",
            "string.empty": "email cannot be empty",
          }),
      }),
  },
};
