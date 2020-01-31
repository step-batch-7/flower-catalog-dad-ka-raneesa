'use strict';

const request = require('supertest');
const { app } = require('../lib/handlers');

const statusCodes = {
  'OK': 200
};

describe('GET home page', function() {
  it('Should get home page / path', function(done) {
    request(app.connectionListener.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(statusCodes.OK)
      .expect('COntent-Type', 'text/html')
      .expect('Content-Length', '995')
      .expect(/abeliophyllum/)
      .expect(/agerantum/)
      .expect(/guestBook/, done);
  });
});
