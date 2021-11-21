const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../utils');
const InvariantError = require('../exceptions/InvariantError');
// const NotFoundError = require('../exceptions/NotFoundError');
// const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistid, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistid, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(playlist) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1 GROUP BY songs.id`,
      values: [playlist],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async deleteSongsInPlaylist(playlistid, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id= $1 AND song_id = $2',
      values: [playlistid, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }
  }

  async verifyPlaylistSong(playistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount()) {
      throw new InvariantError('Lagu Gagal diverifikasi');
    }
  }
}

module.exports = PlaylistSongsService;
