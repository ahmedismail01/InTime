const joi = require("joi");
const { default: mongoose } = require("mongoose");

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
        tag: joi
          .object()
          .allow("", null)
          .keys({ name: joi.string().required(), color: joi.string() }),
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
  getTasks: {
    query: joi.object().keys({
      projectId: joi
        .string()
        .custom((value, helpers) => {
          if (!mongoose.isValidObjectId(value)) {
            return helpers.message("please enter a valid project id");
          }
          return new mongoose.Types.ObjectId(value);
        })
        .optional(),
      name: joi.string().allow("", null),
      startAt: joi.date().allow("", null),
      endAt: joi.date().allow("", null),
      disc: joi.string().allow("", null),
      tag: joi.string().allow("", null),
      priority: joi.number().greater(-1).less(4),
      page: joi.number().integer().min(1).default(1),
      sortingType: joi.string().allow("", null),
      size: joi
        .number()
        .custom((value) => (value == 0 ? 10 : value))
        .integer()
        .min(1)
        .max(100)
        .default(10),
    }),
  },
  search: {
    params: joi.object().keys({
      text: joi.string().required(),
    }),
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      size: joi
        .number()
        .custom((value) => (value == 0 ? 10 : value))
        .integer()
        .min(1)
        .max(100)
        .default(10),
    }),
  },
};
