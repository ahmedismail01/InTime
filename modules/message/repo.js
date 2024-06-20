const Model = require("./model");
const isExists = async (query) => {
  const object = await Model.findOne(query);
  if (object)
    return {
      success: true,
      record: object,
      status: 200,
    };
  return {
    success: false,
    status: 404,
  };
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

const create = async (query) => {
  try {
    const Message = await Model.create(query);
    if (Model) {
      return { success: true, record: Message };
    } else {
      return { success: false, message: "something went wrong" };
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
    if (filter) {
      const Model = await Model.deleteOne(filter);
      return {
        success: true,
        record: Model,
      };
    } else {
      return { success: false, message: "you have to send a filter" };
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

module.exports = {
  list,
  get,
  create,
  remove,
};
