const projectRepo = require("../../modules/project/repo");
const otpRepo = require("../../modules/otp/repo");
const taskRepo = require("../../modules/task/repo");
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
  const groups = await projectRepo.list({ "members.memberId": userId });
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
  res.json({ success: true, link: link });
};

const joinProject = async (req, res) => {
  const userId = req.user.id;
  const { otp, projectId } = req.params;
  console.log(otp);
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
  res.json(task);
};

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  editProject,
  generateInviteLink,
  joinProject,
  assignTask,
};
