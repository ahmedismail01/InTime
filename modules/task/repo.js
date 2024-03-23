const Model = require("./model");

const isExists = async (query) => {
  if (query) {
    const response = await Model.findOne(query);
    if (response) {
      return {
        success: true,
        record: response,
        status: 200,
      };
    } else {
      return {
        success: false,
        message: "task not found",
        status: 401,
      };
    }
  } else {
    return {
      success: false,
      message: "you have to send a query",
    };
  }
};

const list = async (query) => {
  if (query) return await Model.find(query);
  else return await Model.find({});
};
const get = async (query) => {
  if (query) return await isExists(query);
  else return { message: "you have to send a query" };
};

const update = async (query, form) => {
  const ifExists = await isExists(query);
  if (ifExists.success) {
    try {
      if (ifExists.record.name == form?.name) {
        return {
          success: false,
          message: "you have task with the same name",
        };
      }
      const updated = await Model.findOneAndUpdate(query, form, { new: true });
      return {
        success: true,
        record: updated,
      };
    } catch (err) {
      console.log(err);
    }
  } else {
    return {
      success: false,
      message: "Task not found",
    };
  }
};

const remove = async (id) => {
  if (await isExists({ _id: id })) {
    try {
      const deleted = await Model.deleteOne({ _id: id });

      return {
        success: true,
        record: deleted,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "something went wrong",
        error: error,
      };
    }
  } else {
    return {
      success: false,
      message: "task not found",
    };
  }
};

const create = async (form) => {
  try {
    const exists = await isExists({ name: form.name, userId: form.userId });
    if (exists.success) {
      return {
        success: false,
        message: "you have task with the same name",
      };
    }
    const created = new Model(form);
    await created.save();
    return {
      success: true,
      record: created,
    };
  } catch (error) {
    return {
      
      success: false,
      message: "something went wrong",
      error: error,
    };
  }
};

module.exports = {
  get,
  list,
  create,
  isExists,
  remove,
  update,
};
