const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  songid: Joi.string().required(),
});

module.exports = { PlaylistSongPayloadSchema };
