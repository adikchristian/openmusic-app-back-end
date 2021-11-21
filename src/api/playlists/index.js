const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    service, playlistSongsService, songsService, validator,
  }) => {
    const playlitsHandler = new PlaylistsHandler(service, playlistSongsService, songsService, validator);
    server.route(routes(playlitsHandler));
  },
};
