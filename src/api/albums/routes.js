// require handler hilang diganti fungsi agar tak bergantungan

const routes = (handler) => [

  // album masuk sini semua
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbbumByIdHandler,
  },

  // Lagu masuk sini semua
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongsByIdHandler,
  },
];

module.exports = routes;
