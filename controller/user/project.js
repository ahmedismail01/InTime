const projectRepo = require("../../modules/project/repo");
const otpRepo = require("../../modules/otp/repo");
const taskRepo = require("../../modules/task/repo");
const userRepo = require("../../modules/user/repo");
const scheduleTasks = require("../../helpers/scheduler/tasks");
const { handleWebPushForUsers } = require("../../helpers/webPush");

const createProject = async (req, res) => {
  const adminId = req.user.id;
  const projectName = req.body.name;
  const photo = req.file?.filename;
  const form = {
    name: projectName,
    members: [
      {
        memberId: adminId,
        role: "admin",
      },
    ],
    photo: photo,
  };
  res.json(await projectRepo.create(form));
};
const getMyProjects = async (req, res) => {
  const userId = req.user.id;
  const query = req?.query || {};
  const role = query.role;

  const projectMatch = {
    members: {
      $elemMatch: {
        memberId: userId,
      },
    },
  };

  if (role) {
    projectMatch.members.$elemMatch.role = role;
  }

  const groups = await projectRepo.list(projectMatch);
  res.json(groups);
};

const getProject = async (req, res) => {
  const userId = req.user.id;
  const group = await projectRepo.get({
    "members.memberId": userId,
    _id: req.params.id,
  });
  res.json(group);
};

const editProject = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const projectName = req.body?.name;
  const photo = req.file?.filename;
  const project = await projectRepo.get({
    _id: projectId,
    "members.memberId": userId,
    "members.role": "admin",
  });
  if (!project.success) {
    return res.json(project);
  }
  const form = {
    name: projectName,
    photo: photo,
  };
  const isAdmin = project.record.members.find(
    (member) => member.memberId.toString() === userId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to update this project.",
    });
  }
  const updatedProject = await projectRepo.update({ _id: projectId }, form);
  res.json(updatedProject);
};
const generateInviteLink = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const project = await projectRepo.get({
    _id: projectId,
    "members.memberId": userId,
    "members.role": "admin",
  });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) => member.memberId.toString() === userId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to invite other members.",
    });
  }
  const otp = await otpRepo.createOtp({ projectId: projectId });
  const link = `https://intime-9hga.onrender.com/api/v1/user/projects/joinProject/${projectId}/${otp.otp}`;
  res.json({
    success: true,
    link: link,
  });
};

const joinProject = async (req, res) => {
  const userId = req.user.id;
  const { otp, projectId } = req.params;
  const verifyOtp = await otpRepo.verifyOtp({ projectId: projectId }, otp);
  if (!verifyOtp.success) {
    return res.json(verifyOtp);
  }
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isMember = project.record.members.find(
    (member) => member.memberId.toString() === userId
  );
  if (isMember) {
    return res.json({
      success: false,
      message: "user already a member of the project",
    });
  }
  project.record.members.push({ memberId: userId, role: "user" });
  const payload = JSON.stringify({
    title: "member joined",
    message: `Someone joined your project ${project.record.name}, go check him out`,
  });

  const admin = project.record.members.find(
    (member) => member.role === "admin"
  );
  handleWebPushForUsers(admin.memberId, payload);
  const updatedProject = await projectRepo.update(
    { _id: projectId },
    { members: project.record.members }
  );
  res.json(updatedProject);
};
const assignTask = async (req, res) => {
  const adminId = req.user.id;
  const { userId, projectId } = req.params;
  const form = req.body;
  form.projectTask = true;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) =>
      member.memberId.toString() === adminId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to assign tasks.",
    });
  }
  const isMember = project.record.members.find(
    (member) => member.memberId.toString() === userId
  );
  if (!isMember) {
    return res.json({
      success: false,
      message:
        "the user you are trying to assign this task for is not a member of this project.",
    });
  }
  form.userId = userId;
  form.projectId = projectId;
  const task = await taskRepo.create(form);
  if (task.success) {
    const payload = JSON.stringify({
      title: "task assigned",
      message: `You have been given a task from project ${project.record.name}, go check it out`,
    });
    handleWebPushForUsers(userId, payload);
    const user = await userRepo.update(
      { _id: userId },
      { $inc: { "tasks.onGoingTasks": 1 } }
    );
  }
  scheduleTasks();
  res.json(task);
};
const getProjectTasks = async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isMember = project.record.members.find(
    (member) => member.memberId.toString() === userId
  );
  if (!isMember) {
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }
  const projectTasks = await taskRepo.list({ projectId: projectId });
  res.json({ success: true, record: projectTasks });
};
const getMemebers = async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const memberIds = project.record.members.map((member) => member.memberId);
  const isMember = project.record.members.find(
    (member) => member.memberId.toString() === userId
  );
  if (!isMember) {
    return res.json({
      success: false,
      message: "Unauthorized",
    });
  }
  const groupMembers = await userRepo.list({ _id: memberIds });
  res.json({ success: true, record: groupMembers });
};
const removeMember = async (req, res) => {
  const adminId = req.user.id;
  const { userId, projectId } = req.params;
  const form = req.body;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) =>
      member.memberId.toString() === adminId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to remove members.",
    });
  }
  const updatedProject = await projectRepo.removeMember(projectId, userId);
  res.json(updatedProject);
};
const editProjectTask = async (req, res) => {
  const adminId = req.user.id;
  const { taskId, projectId } = req.params;
  const form = req.body;
  const image = req.file?.filename;
  form.image = image;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) =>
      member.memberId.toString() === adminId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to update members tasks.",
    });
  }
  const wantedTask = await taskRepo.get({ _id: taskId, projectId: projectId });
  if (wantedTask.success) {
    const updatedTask = await taskRepo.update(
      { _id: taskId, projectId: projectId, userId: wantedTask.record.userId },
      form
    );
    scheduleTasks();

    return res.json(updatedTask);
  }
  res.json(wantedTask);
};

const removeProject = async (req, res) => {
  const adminId = req.user.id;
  const { projectId } = req.params;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) =>
      member.memberId.toString() === adminId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to remove the project.",
    });
  }
  const removedProject = await projectRepo.remove({ _id: projectId });
  const removedTasks = await taskRepo.remove({ projectId: projectId });
  scheduleTasks();

  res.json(removedProject);
};
const removeProjectTask = async (req, res) => {
  const adminId = req.user.id;
  const { projectId, taskId } = req.params;
  const project = await projectRepo.get({ _id: projectId });
  if (!project.success) {
    return res.json(project);
  }
  const isAdmin = project.record.members.find(
    (member) =>
      member.memberId.toString() === adminId && member.role === "admin"
  );
  if (!isAdmin) {
    return res.json({
      success: false,
      message: "user is not authorized to remove the project.",
    });
  }
  const removedTask = await taskRepo.remove({
    _id: taskId,
    projectId: projectId,
  });
  if (removedTask.success) {
    if (removedTask.record.completed == true) {
      const user = await userRepo.update(
        { _id: removedTask.record.userId },
        { $inc: { "tasks.completedTasks": -1 } }
      );
    } else {
      const user = await userRepo.update(
        { _id: removedTask.record.userId },
        { $inc: { "tasks.onGoingTasks": -1 } }
      );
    }
  }
  scheduleTasks();

  res.json(removedTask);
};
const removeProjectPhoto = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { projectId } = req.params;
    const project = await projectRepo.get({ _id: projectId });
    if (!project.success) {
      return res.json(project);
    }
    const isAdmin = project.record.members.find(
      (member) =>
        member.memberId.toString() === adminId && member.role === "admin"
    );
    if (!isAdmin) {
      return res.json({
        success: false,
        message: "user is not authorized to remove the project image.",
      });
    }
    const updatedProject = await projectRepo.update(
      { _id: projectId },
      { photo: "" }
    );
    res.json({ updatedProject });
  } catch (err) {
    return res.status(500).json({ success: "false", message: err.message });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  editProject,
  generateInviteLink,
  joinProject,
  assignTask,
  getProjectTasks,
  getMemebers,
  editProjectTask,
  removeMember,
  removeProject,
  removeProjectTask,
  removeProjectPhoto,
};
