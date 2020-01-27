const fs = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplate');
const SYMBOLS = require('./lib/symbols');
const STATIC_FOLDER = `${__dirname}/public`;

const loadComments = function() {
  const COMMENTS_PATH = './data/comments.json';
  if (fs.existsSync(COMMENTS_PATH)) {
    return JSON.parse(fs.readFileSync(COMMENTS_PATH));
  }
  return [];
};

const generateComment = function(commentsHtml, commentDetails) {
  const { date, name, comment } = commentDetails;
  const html = `<tbody><td class="date">${date}</td>
    <td class="name">${name}</td>
    <td class="comment">${comment.replace(/\n/g, '</br>')}</td></tbody>`;
  return html + commentsHtml;
};

const generateComments = () => {
  const comments = loadComments();
  const html = comments.reduce(generateComment, '');
  return html;
};

const serveGuestBookPage = function() {
  const commentsHtml = generateComments();
  const html = loadTemplate('guestBook.html', { COMMENTS: commentsHtml });
  const res = new Response();
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
}

const replaceUnknownChars = function(text, character) {
  const regEx = new RegExp(`${character}`, 'g');
  return text.replace(regEx, SYMBOLS[character]);
};

const saveCommentAndRedirect = function(req) {
  const comments = loadComments();
  const date = new Date().toGMTString();
  const { name, comment } = req.body;
  const keys = Object.keys(SYMBOLS);
  const [nameText, commentText] = [name, comment].map(text => keys.reduce(replaceUnknownChars, text));
  comments.push({ date, name: nameText, comment: commentText });
  if (!fs.existsSync('./data')) fs.mkdirSync('./data');
  fs.writeFileSync('./data/comments.json', JSON.stringify(comments), 'utf8');
  return serveGuestBookPage();
}

const serveStaticFile = (req, optionalUrl) => {
  const path = `${STATIC_FOLDER}${optionalUrl || req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
}

const serveHomePage = function(req) {
  return serveStaticFile(req, '/home.html');
};

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'POST' && req.url === '/saveComment') return saveCommentAndRedirect;
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestBookPage;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
}
const processRequest = (req) => {
  const handler = findHandler(req);
  return handler(req);
}

module.exports = { processRequest };