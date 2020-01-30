const { Server } = require('http');
const App = require('./app');
const handlers = require('./handlers');

const defaultPort = 4000;

const app = new App();

app.get('/guestBook.html', handlers.serveGuestBookPage);
app.post('/saveComment', handlers.saveCommentAndRedirect);
app.get('', handlers.serveStaticFile);
app.get('', handlers.serveNotFoundPage);
app.use('', handlers.serveBadRequestPage);
app.post('', handlers.serveNotFoundPage);

const main = function(port = defaultPort) {
  const server = new Server(app.connectionListener.bind(app));
  server.listen(port, () => {
    process.stderr.write('server is listening at ', server.address());
  });
};

const [, , port] = process.argv;

main(port);
