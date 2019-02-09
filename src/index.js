const fs = require('fs');
const LyricsDatabase = require('./LyricsDatabase.js');
const {parseAny, parseDir} = require('./parser.js');

const print = console.log;

function /** void */ exportZip(db, path) {
  db.getZip().writeZip(path);
}

function /** void */ exportHtml(db, path, level) {
  fs.writeFileSync(path, db.getHtml(level));
}

module.exports = {
  print,
  LyricsDatabase,
  parseAny,
  parseDir,
  exportHtml,
  exportZip,
}
