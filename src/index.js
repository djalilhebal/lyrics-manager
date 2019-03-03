const fs = require('fs');
const glob = require('glob');

const LyricsDatabase = require('./LyricsDatabase.js');
const Song = require('./Song.js');
const parser = require('./parser.js');
const any = parser.any;

/// Parses files in `root` and inserts them in `db`
function /** void */ loadDir(/** LyricsDatabase */ db, /** string */ root) {
  const paths = glob.sync(root + '/**', {nodir: true});
  paths
  .filter(any.accepts)
  .forEach( (path) => {
    const content = fs.readFileSync(path, 'utf8');
    const result = any.parse(path, content);
    // DarkLyrics returns an array of songs
    if (Array.isArray(result)) {
      result.forEach(x => db.addSong(x));
    } else {
      db.addSong(result);
    }
  });
}

function /** void */ saveZip(db, path) {
  db.getZip().writeZip(path);
}

function /** void */ saveHtml(db, path, level) {
  fs.writeFileSync(path, db.getHtml(level));
}

module.exports = {
  LyricsDatabase,
  Song,
  ...parser,
  loadDir,
  saveHtml,
  saveZip,
}
