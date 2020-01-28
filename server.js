const { Server } = require('http');
const { processRequest } = require('./app');

const main = function(port = 4000) {
  const server = new Server(processRequest);
  server.listen(port, () => {
    console.log('Listening in ', port);
  })
}

main(process.argv[2]);
