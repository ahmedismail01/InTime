const repo = require("./../../modules/task/repo");

const createTask =async (req, res) => {
  const user = req.user;
  const form = req.body;
  form.userId = user.id
  const created = await repo.create(form);
  res.json(created);
};


module.exports = {
  createTask
}
