const Model = require("./model");
const mongoose = require("mongoose");
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

const list = async (query, sortBy, sortingType) => {
  try {
    if (!sortingType) {
      sortingType = 1;
    }
    if (query)
      return await Model.find(query).sort([[`${sortBy}`, Number(sortingType)]]);
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
      if (ifExists.record.name == form?.name) {
        return {
          success: false,
          message: "you have task with the same name",
          status: 400,
        };
      }
      if (!(form.startAt && form.endAt)) {
        if (
          ifExists.record.endAt <= new Date(form.startAt) ||
          ifExists.record.startAt >= new Date(form.endAt)
        ) {
          return {
            success: false,
            message: "start date cant be after the end date or the same date",
            status: 400,
          };
        }
      }
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
        record: ifExists.record,
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
    const exists = await isExists({ name: form.name, userId: form.userId });
    if (exists.success) {
      return {
        success: false,
        message: "there is a task with the same name in this user tasks",
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
const search = async (userId, searchString) => {
  try {
    return await Model.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          name: { $regex: searchString },
        },
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  get,
  list,
  create,
  isExists,
  remove,
  update,
  search,
};
