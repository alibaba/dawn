module.exports = function () {
  return async function (next) {
    this.console.log('mw1.js');
    next();
  };
};