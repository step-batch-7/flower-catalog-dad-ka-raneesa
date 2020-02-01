'use strict';

const fs = require('fs');
const App = require('./app');
const queryString = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const { loadTemplate } = require('./viewTemplate');
const STATIC_FOLDER = `${__dirname}/../public`;
const { COMMENTS_PATH } = require('../config');

const getUrl = function(url) {
  return url === '/' ? '/home.html' : url;
};

const areStatsNotOk = function(stat) {
  return !stat || !stat.isFile();
};

const serveStaticFile = function(req, res, next) {
  const file = getUrl(req.url);
  const path = `${STATIC_FOLDER}${file}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (areStatsNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const redirectTo = function(res, url) {
  res.setHeader('Location', url);
  res.statusCode = 301;
  res.end();
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = queryString.parse(data);
    next();
  });
};

const saveCommentAndRedirect = function(req, res) {
  const comments = loadComments();
  const date = new Date();
  const { name, comment } = req.body;
  comments.push({ date, name, comment });
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(comments), 'utf8');
  return redirectTo(res, '/guestBook.html');
};

const generateComment = function(commentsHtml, commentDetails) {
  const { date, name, comment } = commentDetails;
  const html = `<tbody><td class="date">${new Date(date).toGMTString()}</td>
    <td class="name">${name}</td>
    <td class="comment">${comment.replace(/\n/g, '</br>')}</td></tbody>`;
  return html + commentsHtml;
};

const loadComments = function() {
  if (fs.existsSync(COMMENTS_PATH)) {
    return JSON.parse(fs.readFileSync(COMMENTS_PATH, 'utf8') || '[]');
  }
  return [];
};

const generateComments = () => {
  const comments = loadComments();
  const html = comments.reduce(generateComment, '');
  return html;
};

const serveGuestBookPage = function(req, res) {
  const commentsHtml = generateComments();
  const html = loadTemplate('guestBook.html', { COMMENTS: commentsHtml });
  res.setHeader('Content-Length', Buffer.from(html).length);
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.end(html);
};

const serveNotFoundPage = function(req, res) {
  const html =
    `<html>
    <head>
      <title>Bad Request</title>
    </head>
    <body>
      <p>404 File not found</p>
    </body>
    </html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 404;
  res.end('Not Found');
};

const serveBadRequestPage = function(req, res) {
  const html =
    `<html>
    <head>
      <title>Bad Request</title>
    </head>
    <body>
      <p>400 Your browser sent a request that this server could not understand.
Bad Request - Inv</p>
    </body>
    </html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 405;
  res.end(html);

};

const app = new App();

app.get('/guestBook.html', serveGuestBookPage);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);
app.use(readBody);
app.post('/saveComment', saveCommentAndRedirect);
app.post('', serveNotFoundPage);
app.use(serveBadRequestPage);

module.exports = { app };
