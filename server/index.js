'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: 8000
});

// Add the route
server.route({
  method: 'GET',
  path: '/books',
  handler: (request, reply) => {
    return reply([
      {
        id:1,
        name:'Livro 1'
      },
      {
        id:2,
        name:'Livro 2'
      }
    ]);
  }
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
})
