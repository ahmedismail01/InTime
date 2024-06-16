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
        status: 400,
      };
    }
  } else {
    return {
      success: false,
      message: "you have to send a query",
    };
  }
};

const list = async (query, sortBy) => {
  try {
    if (query) return await Model.find(query).sort(sortBy);
    else return await Model.find({});
  } catch (err) {
    console.log(err);
  }
};

const get = async (query) => {
  try {
    if (query) return await isExists(query);
    else return { message: "you have to send a query" };
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      status: 500,
      err: err.message,
    };
  }
};

const update = async (query, form) => {
  try {
    const ifExists = await isExists(query);
    if (ifExists.success) {
      const updated = await Model.findOneAndUpdate(query, form, { new: true });
      return {
        success: true,
        record: updated,
        status: 201,
      };
    } else {
      return ifExists;
    }
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      status: 500,
      err: err.message,
    };
  }
};

const remove = async (filter) => {
  try {
    const ifExists = await isExists(filter);
    if (ifExists.success) {
      const deleted = await Model.deleteMany(filter);

      return {
        success: true,
        record: deleted,
        status: 200,
      };
    } else {
      return ifExists;
    }
  } catch (error) {
    return {
      success: false,
      message: "something went wrong",
      error: error,
      status: 500,
    };
  }
};

const create = async (form) => {
  try {
    const exists = await isExists({ name: form.name });
    if (exists.success) {
      return {
        success: false,
        message: "this name is already used",
        status: 403,
      };
    }
    const created = new Model(form);
    await created.save();
    return {
      success: true,
      record: created,
      status: 201,
    };
  } catch (error) {
    return {
      success: false,
      message: "something went wrong",
      status: 500,
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
