class UploadsHandler {
  constructor(storageService, albumService, validator) {
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const { id } = request.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const address = `${request.headers['x-forwarded-proto'] || request.server.info.protocol}://${request.info.host}/upload/images/${filename}`;
    await this._albumService.editAlbumCover(id, address);

    const response = h.response({
      status: 'success',
      message: address,
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
