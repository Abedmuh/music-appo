require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/albums');
const PostgretService = require('./service/postgres/AlbumsService');
const PostgresValidator = require('./validator/postgres');

// users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const postgresService = new PostgretService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: postgresService,
        validator: PostgresValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
