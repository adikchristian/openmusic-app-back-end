exports.up = (pgm) => {
  pgm.addConstraint('playlistsongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongs', 'unique_playlist_id_and_song_id');
};
