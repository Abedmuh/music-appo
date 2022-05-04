const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(storageService, albumService, validator) {
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      this._validator.validateImageHeaders(cover.hapi.headers);
      const { id } = request.params;

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const address = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      await this._albumService.editAlbumCover(id, address);
      console.log(typeof address);

      const response = h.response({
        status: 'success',
        message: {
          address,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UploadsHandler;
