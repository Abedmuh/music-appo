// fokus membuat dan menuliskan objek schema data notes

const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PostSongPayloadSchema,
};
