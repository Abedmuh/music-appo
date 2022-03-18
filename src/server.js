require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/albums');
const PostgretService = require('./service/postgres/AlbumsService');
const PostgresValidator = require('./validator/postgres');

const init = async () => {
  const postgresService = new PostgretService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: postgresService,
      validator: PostgresValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
