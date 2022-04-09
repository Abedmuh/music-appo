const mapDBToModelPlaylist = ({
  id,
  name,
  year,
  owner,
}) => ({
  id,
  name,
  year,
  username: owner,
});

module.exports = { mapDBToModelPlaylist };
