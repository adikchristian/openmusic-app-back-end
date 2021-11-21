const { SongPayLoadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
  validateSongPayLoad: (payload) => {
    const validationResult = SongPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
