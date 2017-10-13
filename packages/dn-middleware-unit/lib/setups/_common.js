global.supertest = require('supertest');
global.chai = require('chai');
global.expect = chai.expect;

global.sleep = function (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};