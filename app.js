const fs = require('fs');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplate');
const SYMBOLS = require('./lib/symbols');
const STATIC_FOLDER = `${__dirname}/public`;

const serverBadRequestPage = function(req, res) {
  const html =
    `<html>
    <head>
      <title>Bad Request</title>
    </head>
    <body>
      <p>404 File not found</p>
    </body>
    </html>`
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.setHeader = 404;
  res.end(html);

};

const loadComments = function() {
  const COMMENTS_PATH = './data/comments.json';
  if (fs.existsSync(COMMENTS_PATH)) {
    return JSON.parse(fs.readFileSync(COMMENTS_PATH));
  }
  return [];
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
  res.statusCode = 200;
  res.end(html);
}

const replaceUnknownChars = function(text, character) {
  const regEx = new RegExp(`${character}`, 'g');
  return text.replace(regEx, SYMBOLS[character]);
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};

const readParams = function(keyValueTextPairs) {
  return keyValueTextPairs.split('&').reduce(pickupParams, {})
};

const saveCommentAndRedirect = function(req, res) {
  let data = '';
  const comments = loadComments();
  const date = new Date();
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const { name, comment } = readParams(data);
    const keys = Object.keys(SYMBOLS);
    const [nameText, commentText] = [name, comment].map(text => keys.reduce(replaceUnknownChars, text));
    comments.push({ date, name: nameText, comment: commentText });
    if (!fs.existsSync('./data')) fs.mkdirSync('./data');
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments), 'utf8');
    serveGuestBookPage(req, res);
  })
}

const serveStaticFile = (req, res, optionalUrl) => {
  const path = `${STATIC_FOLDER}${optionalUrl || req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return serverBadRequestPage(req, res);
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.end(content);
}

const serveHomePage = function(req, res) {
  return serveStaticFile(req, res, '/home.html');
};

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'POST' && req.url === '/saveComment') return saveCommentAndRedirect;
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestBookPage;
  if (req.method === 'GET') return serveStaticFile;
  return () => serverBadRequestPage;
}
const processRequest = (req, res) => {
  const handler = findHandler(req);
  handler(req, res);
}

module.exports = { processRequest };