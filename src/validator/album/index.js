// fokus dalam membuat fungsi sebagai validator yang menggunakan schema dari schema.js

const { SongsPayloadSchema, AlbumsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PostgresValidator = {
  validateAlbumsPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PostgresValidator;
