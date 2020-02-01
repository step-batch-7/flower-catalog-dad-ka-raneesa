'use strict';

const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET home page', () => {
  it('Should get home page / path', (done) => {
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

  it('Should get index.css for css/index.css path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '993')
      .expect(/body {/, done);
  });

  it('should get hideWaterJug.js for /js/hideWateringCan.js path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/js/hideWateringCan.js')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/javascript')
      .expect('Content-length', '250')
      .expect(/hidden/, done);
  });

  it('should get freshorigins image for /pictures/freshorigins.jpg', (done) => {
    request(app.connectionListener.bind(app))
      .get('/pictures/freshorigins.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpeg')
      .expect('Content-length', '381314', done);
  });

  it('should get gif for /pictures/animated-flower-image-0021.gif', (done) => {
    request(app.connectionListener.bind(app))
      .get('/pictures/animated-flower-image-0021.gif')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/gif')
      .expect('Content-length', '65088', done);
  });
});

describe('GET Abeliophyllum page', () => {
  it('should get abeliophyllum.html for /abeliophyllum.html', (done) => {
    request(app.connectionListener.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-length', '1671')
      .expect(/Abeliophyllum/, done);
  });

  it('should get index.css for /css/index.css path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-length', '993')
      .expect(/body {/, done);
  });

  it('Get abeliophyllum for /pictures/pbase-abeliophyllum.jpg path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/pictures/pbase-abeliophyllum.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpeg')
      .expect('Content-length', '87413', done);
  });

  it('Get Abeliophyllum pdf for /assets/abeliophyllum.pdf', (done) => {
    request(app.connectionListener.bind(app))
      .get('/assets/abeliophyllum.pdf')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .expect('Content-length', '35864', done);
  });
});

describe('GET Ageratum page', () => {
  it('should get ageratum.html for /ageratum.html', (done) => {
    request(app.connectionListener.bind(app))
      .get('/agerantum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-length', '1427')
      .expect(/Agerantum/, done);
  });

  it('should get index.css for /css/index.css path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-length', '993')
      .expect(/body {/, done);
  });

  it('should get agerantum for /pictures/pbase-agerantum.jpg path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/pictures/pbase-agerantum.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpeg')
      .expect('Content-length', '55554', done);
  });

  it('should get Ageratum pdf for /assets/ageratum.pdf', (done) => {
    request(app.connectionListener.bind(app))
      .get('/assets/ageratum.pdf')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .expect('Content-length', '140228', done);
  });
});

describe('GET guestBook page', () => {
  it('Should get guestBook page templates/guestBook.html path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(/DATETIME/)
      .expect(/NAME/)
      .expect(/COMMENTS_LIST/, done);
  });

  it('should get index.css for /css/index.css path', (done) => {
    request(app.connectionListener.bind(app))
      .get('/css/index.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-length', '993')
      .expect(/.header {/, done);
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
