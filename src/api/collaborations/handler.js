class CollaboratorService {
  constructor(collaborationsService, playlistService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistService = playlistService;
    this._validator = validator;
    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, res) {
    this._validator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaborator(playlistId, userId);

    const response = res.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CollaboratorService;
