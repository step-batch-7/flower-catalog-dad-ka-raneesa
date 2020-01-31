'use strict';

const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET home page', function() {
  it('Should get home page / path', function(done) {
    request(app.connectionListener.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '995')
      .expect(/abeliophyllum/)
      .expect(/agerantum/)
      .expect(/guestBook/, done);
  });

  it('Should get guestBook page path', function(done) {
    request(app.connectionListener.bind(app))
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(/DATETIME/)
      .expect(/NAME/)
      .expect(/COMMENTS_LIST/, done);
  });
});

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', (done) => {
    request(app.connectionListener.bind(app))
      .get('/badPage')
      .expect(404, done);
  });
});

describe('POST nonExisting Url', () => {
  it('should return 404 for a non existing page', (done) => {
    request(app.connectionListener.bind(app))
      .post('/badPage')
      .expect(404, done);
  });
});

describe('PUT nonExisting method', () => {
  it('should return 405 for a non existing method', (done) => {
    request(app.connectionListener.bind(app))
      .put('/')
      .expect(405, done);
  });
});

describe('POST /saveComment', () => {
  it('should post on the saveComment url', (done) => {
    request(app.connectionListener.bind(app))
      .post('/saveComment')
      .send('name=Ranbir')
      .send('comment=hello')
      .expect(301, done);
  });
});
