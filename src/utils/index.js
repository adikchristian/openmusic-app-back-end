/* eslint-disable camelcase */
const mapDBToModel = ({ created_at, updated_at, ...args }) => ({
  ...args,
  insertedAt: created_at,
  updatedAt: updated_at,
});

const mapDBToModelPlaylist = ({ id, name, username }) => ({ id, name, username });

module.exports = { mapDBToModel, mapDBToModelPlaylist };
