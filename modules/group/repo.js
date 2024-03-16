const Model = require("./model");

const isExists = async (query) => {
  if (query) {
    const response = Model.findOne(query);
    if (response) {
      return {
        success: true,
        record: response,
        status: 200,
      };
    } else {
      return {
        success: false,
        message: "Model not found",
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

const update = async (id, form) => {
  const ifExists = await isExists({ _id: id });
  if (ifExists.success) {
    try {
      const updated = await Model.updateOne({ _id: id }, form);
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
      message: "Model not found",
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
      message: "Model not found",
    };
  }
};

const create = async (form) => {
  try {
    const created = new Model(form);
    return {
      success: true,
      record: created,
    };
  } catch (error) {
    console.log(error);
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
