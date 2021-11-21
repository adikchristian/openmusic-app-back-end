const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistid}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistid}/songs',
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistid}/songs',
    handler: handler.getPlaylistSongHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistid}/songs',
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
