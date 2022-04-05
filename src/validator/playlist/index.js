// fokus dalam membuat fungsi sebagai validator yang menggunakan schema dari schema.js

const { PlaylistPayloadSchema, PostSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongPayload: (payload) => {
    const validationResult = PostSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
