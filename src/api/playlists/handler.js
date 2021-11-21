class PlaylistHandler {
  constructor(service, playlistSongsService, songsService, validator) {
    this._service = service;
    this._playlistSongService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistHandler(req, res) {
    this._validator.validatePlaylistPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    const response = res.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(req) {
    const { playlistid } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistid, credentialId);
    await this._service.deletePlaylist(playlistid);
    return {
      status: 'success',
      message: 'Playlists berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(req, res) {
    const { playlistid } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    await this._songsService.verifySong(songId);
    await this._service.verifyPlaylistAccess(playlistid, credentialId);
    await this._playlistSongService.addSongToPlaylist(playlistid, songId);

    const response = res.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(req) {
    const { playlistid } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistid, credentialId);
    const songs = await this._playlistSongService.getSongsInPlaylist(playlistid);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deletePlaylistSongHandler(req) {
    const { playlistid } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    await this._songsService.verifySong(songId);
    await this._service.verifyPlaylistAccess(playlistid, credentialId);
    await this._playlistSongService.deleteSongsInPlaylist(playlistid, songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistHandler;
