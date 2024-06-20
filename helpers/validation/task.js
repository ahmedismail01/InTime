const joi = require("joi");

module.exports = {
  createTask: {
    body: joi
      .object()
      .required()
      .empty()
      .keys({
        name: joi.string().empty().required().messages({
          "string.required": "please enter the task name",
          "string.empty": "name cannot be empty",
        }),
        startAt: joi.date().empty().iso().required(),
        endAt: joi.date().empty().iso().greater(joi.ref("startAt")).required(),
        disc: joi.string().allow("", null),
        tag: joi.object().allow("", null),
        priority: joi.number(),
        steps: joi.array(),
        image: joi.string().allow("", null),
      }),
  },
  updateTask: {
    body: joi
      .object()
      .required()
      .empty()
      .keys({
        name: joi.string(),
        startAt: joi.date().iso(),
        endAt: joi.date().iso(),
        disc: joi.string().allow("", null),
        tag: joi.object().allow("", null),
        priority: joi.number().greater(-1).less(4),
        steps: joi.array(),
        image: joi.string().allow("", null),
      }),
  },
};
