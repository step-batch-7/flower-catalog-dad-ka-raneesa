const { Server } = require('http');
const { app } = require('./lib/handler');

const defaultPort = 4000;

const main = function(port = defaultPort) {
  const server = new Server(app.connectionListener.bind(app));
  server.listen(port, () => {
    const address = `${server.address().address} ${server.address().port}`;
    process.stderr.write(`server is listening at ${address}`);
  });
};

const [, , port] = process.argv;

main(port);
