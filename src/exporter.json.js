//TODO Use `Object.fromEntries`
function /** string */ generateJson(/** Map*/ db, /** boolean */ space = true) {
  const dbObj = {};

  db.forEach( (artist, artistName) => {
    dbObj[artistName] = {};
    artist.forEach( (album, albumName) => {
      dbObj[artistName][albumName] = {};
      album.forEach( (song, songTitle) => {
        dbObj[artistName][albumName][songTitle] = song;
      });
    });
  });
  
  const spaceStr = space ? ' ' : '';
  const json = JSON.stringify(dbObj, null, spaceStr); // with whitespace
  return json;
}

module.exports = generateJson;
