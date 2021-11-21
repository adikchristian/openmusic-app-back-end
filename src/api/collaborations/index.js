const CollaboartionHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaboartions',
  version: '1.0.0',
  register: async (server, {
    collaborations, playlistService, validator,
  }) => {
    const collaborationsHandler = new CollaboartionHandler(
      collaborations,
      playlistService,
      validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
