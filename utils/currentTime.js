module.exports.getCurrentTime = () => {
  const currentTime = new Date(Date.now()).toString().split(" ");
  const formatedTime = `[${
    currentTime[4] + " " + currentTime[2] + " " + currentTime[1]
  }]`;

  return formatedTime;
};
