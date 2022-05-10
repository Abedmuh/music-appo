/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likecount', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('likecount', 'fk_likecount.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('likecount', 'fk_likecount.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('likecount');
};
