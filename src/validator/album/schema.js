// fokus membuat dan menuliskan objek schema data notes

const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  coverUrl: Joi.string().allow(''),
});

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().required(),
});

module.exports = {
  SongsPayloadSchema,
  AlbumsPayloadSchema,
};
