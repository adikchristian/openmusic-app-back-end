const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const songs = require('./api/songs');
const SongsService = require('./service/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./service/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlist
const playlists = require('./api/playlists');
const PlaylistsService = require('./service/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');
const PlaylistSongsService = require('./service/PlaylistSongsService');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./service/CollaboratorService');
const CollaborationsValidator = require('./validator/collaborations');

const ClientError = require('./exceptions/ClientError');
require('dotenv').config();

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        playlistSongsService,
        songsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborations: collaborationsService,
        playlistService: playlistsService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    // mendapatkan konteks response dari request
    const { response } = req;
    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
