/** @deprecated I no longer use this 'format' */
const Song = require('./Song.js');

// path: `mytext_Shinedown/Shinedown - Sound Of Madness.txt`
// pattern: `mytext_ARTIST/ARTIST - SONG.txt`
const rMytextFile = /mytext_(.+)\/\1 - (.+)\.txt$/

function /** boolean */ accepts(/** string */ path) {
  return rMytextFile.test(path);
}

function /** Song */ parse(/** string */ path, /** string */ content) {
  const song = new Song;

  try {
    const firstline = content.slice(0, content.indexOf('\n\n'))
    const parsed = JSON.parse(firstline);
    const lyrics = content.slice(content.indexOf('\n\n') + 2);
    song.setTitle(parsed.song);
    song.setLyrics(lyrics);
    song.setArtist(parsed.artist);
    song.setAlbum(parsed.album);
  } catch (e) {
    const [, artist, title] = path.match(rMytextFile);
    song.setTitle(title);
    song.setLyrics(content);
    song.setArtist(artist);
  }
  
  return song;
}

module.exports = {
  accepts,
  parse
}
