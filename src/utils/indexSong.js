const mapDBToModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  created_at,
  updated_at,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
  albumId: album_id,
});

module.exports = { mapDBToModelSong };
