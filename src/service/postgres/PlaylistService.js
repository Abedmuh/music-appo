const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModelSong } = require('../../utils/indexSong');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT playlist.* FROM playlist
      LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
      WHERE playlist.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlist.id`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('PLaylist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const songquery = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const resultsong = await this._pool.query(songquery);

    if (!resultsong.rows.length) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
    const query = {
      text: 'INSERT INTO songinplaylist (playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!resultsong.rows[0].id && !result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.*
      FROM songs
      JOIN songinplaylist
      ON songs.id = songinplaylist.song_id WHERE songinplaylist.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    console.log(typeof result.rows.map(mapDBToModelSong));

    return result.rows.map(mapDBToModelSong);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM songinplaylist WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistService;
