module.exports = function () {
  return async function (next) {
    this.console.log('mw2.js');
    next();
  };
};