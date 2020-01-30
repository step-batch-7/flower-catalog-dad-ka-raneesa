const fs = require('fs');
const queryString = require('querystring');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplate');
const STATIC_FOLDER = `${__dirname}/public`;

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

const loadComments = function() {
  const COMMENTS_PATH = './data/comments.json';
  if (fs.existsSync(COMMENTS_PATH)) {
    return JSON.parse(fs.readFileSync(COMMENTS_PATH, 'utf8') || '[]');
  }
  return [];
};

const redirectTo = function(res, url) {
  res.setHeader('Location', url);
  res.statusCode = 301;
  res.end();
};

const saveCommentAndRedirect = function(req, res) {
  let data = '';
  const comments = loadComments();
  const date = new Date();
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const { name, comment } = queryString.parse(data);
    comments.push({ date, name, comment });
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments), 'utf8');
    return redirectTo(res, '/guestBook.html');
  });
};

const generateComment = function(commentsHtml, commentDetails) {
  const { date, name, comment } = commentDetails;
  const html = `<tbody><td class="date">${new Date(date).toGMTString()}</td>
    <td class="name">${name}</td>
    <td class="comment">${comment.replace(/\n/g, '</br>')}</td></tbody>`;
  return html + commentsHtml;
};

const generateComments = () => {
  const comments = loadComments();
  const html = comments.reduce(generateComment, '');
  return html;
};

const serveGuestBookPage = function(req, res) {
  const commentsHtml = generateComments();
  const html = loadTemplate('guestBook.html', { COMMENTS: commentsHtml });
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
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
  res.setHeader = 400;
  res.end(html);

};

module.exports = {
  serveStaticFile,
  serveGuestBookPage,
  saveCommentAndRedirect,
  serveNotFoundPage,
  serveBadRequestPage
};
