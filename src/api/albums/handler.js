class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
    this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const album = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const albums = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album: albums,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAlbumAccess(id, credentialId);
    await this._service.addLike(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumHandler(request, h) {
    const { id } = request.params;

    const likes = await this._service.getLike(id);
    console.log(likes);

    const response = h.response({
      status: 'success',
      message: 'like album berhasil didapatkan',
      data: {
        likes: parseInt(likes.convResult),
      },
    });
    response.code(200);
    if (likes.status) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = AlbumsHandler;
