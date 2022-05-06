/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('like', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });

  pgm.addConstraint('like', 'fk_like.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('like', 'fk_like.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('like');
};
