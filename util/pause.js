const sleep = (miliseconds) => {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {}
};
exports.sleep = sleep;
