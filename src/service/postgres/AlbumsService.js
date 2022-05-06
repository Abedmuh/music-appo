const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModelAlbum } = require('../../utils/indexAlbum');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM album');
    return result.rows.map(mapDBToModelAlbum);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album tidak ditemukan');
    }

    return result.rows.map(mapDBToModelAlbum)[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumCover(id, cover) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE album SET updated_at = $1, cover = $2 WHERE id = $3 RETURNING id',
      values: [updatedAt, cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album gagal dihapus. Id tidak ditemukan');
    }
  }

  async postLike(name, albumId) {
    const id = `like-${nanoid(16)}`;

    const checkQuery = {
      text: 'SELECT album_id FROM like WHERE id = $1',
      values: [albumId],
    };

    const checkResult = await this._pool.query(checkQuery);

    let likeMech;
    if (!checkResult.rows.length) {
      likeMech = {
        text: 'INSERT INTO like VALUES($1, $2, $3) RETURNING id',
        values: [id, name, albumId],
      };
    }
    if (checkResult.rows.length) {
      likeMech = {
        text: 'DELETE FROM like WHERE album_id = $1 RETURNING id',
        values: [albumId],
      };
    }

    const result = await this._pool.query(likeMech);

    if (!result.rows[0].id) {
      throw new InvariantError('like gagal ditambahkan');
    }
    if (result.rows[0].id) {
      throw new InvariantError('like berhasil ditambahkan');
    }

    return result.rows[0].id;
  }

  async getLike(id) {
    try {
      const result = await this._cacheService.get(`like:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM like WHERE id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('like gagal ditambahkan');
      }
      return result.rows[0].id;
    }
  }

  async verifyAlbumAccess(albumId, owner) {
    try {
      const query = {
        text: 'SELECT * FROM album WHERE id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Album tidak ditemukan');
      }
      const album = result.rows[0];
      if (album.owner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
    }
  }
}

module.exports = AlbumsService;
