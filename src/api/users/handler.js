class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, res) {
    this._validator.validateUserPayload(payload);
    const { username, password, fullname } = payload;

    const userId = await this._service.addUser({ username, password, fullname });

    const response = res.response({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UserHandler;
