const fs = require('fs');
const glob = require('glob');

const parser = require('./parser.js');

const print = console.log;

const parseAny = parser.parseAny;

function parseDir(db, root) {
  const paths = glob.sync(root + '/**', {nodir: true});
  paths
  .filter(parser.isAcceptablePath)
  .forEach( (path) => {
    const content = fs.readFileSync(path, 'utf8');
    parser.parseAny(path, content).forEach(x => db.addSong(x));
  });
}

function exportZip(db, path) {
  db.getZip().writeZip(path);
}

function exportHtml(db, path, level) {
  fs.writeFileSync(path, db.getHtml(level));
}

module.exports = {
  print,
  parseAny,
  parseDir,
  exportHtml,
  exportZip,
}
