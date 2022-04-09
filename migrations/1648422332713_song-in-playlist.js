/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songinplaylist', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('songinplaylist', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
  pgm.addConstraint('songinplaylist', 'fk_songinplaylist.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('songinplaylist', 'fk_songinplaylist.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('songinplaylist');
};
