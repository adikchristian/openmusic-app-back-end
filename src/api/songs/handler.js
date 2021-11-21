class SongsHandler {
  constructor(service, validator) {
    this.services = service;
    this.validators = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, res) {
    this.validators.validateSongPayLoad(req.payload);
    const {
      title, year, performer, genre, duration,
    } = req.payload;
    const songId = await this.services.addSong({
      title, year, performer, genre, duration,
    });
    const response = res.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongHandler() {
    const songs = await this.services.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const song = await this.services.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(req) {
    this.validators.validateSongPayLoad(req.payload);
    const { id } = req.params;
    await this.services.editSongById(id, req.payload);
    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this.services.deleteSongById(id);
    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
