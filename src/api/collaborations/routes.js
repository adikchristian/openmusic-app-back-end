const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
