const fs = require('fs');
const glob = require('glob');

const {print} = require('./index.js');
const azlyrics = require('./parse.azlyrics.js');
const darklyrics = require('./parse.darklyrics.js');
const mytext = require('./parse.mytext.js');

const supported = [azlyrics, darklyrics, mytext];
const isAcceptablePath = (p) => supported.some( x => x.accepts(p));

function /** void */ parseDir(/** LyricsDatabase */ db, /** string */ root) {
  const paths = glob.sync(root + '/**', {nodir: true});
  paths
  .filter(isAcceptablePath)
  .forEach( (path) => {
    const content = fs.readFileSync(path, 'utf8');
    parseAny(path, content).forEach(x => db.addSong(x));
  });
}

function /** Song[] */ parseAny(/** string */ path, /** string */ content) {
  if (!isAcceptablePath(path) || !content || !content.length) {
    print(`unaccaptable input:\n  path: ${path}\n  content: ${content}`);
    return [];
  }
  
  try {
    for (let i = 0; i < supported.length; i++) {
      if (supported[i].accepts(path)) {
        const result = supported[i].parse(path, content);
        if (Array.isArray(result))
          return result;
        else 
          return [result];
      }
    }
  } catch(e) {
    print(e, path, content)
  }
}

module.exports = {
  azlyrics,
  darklyrics,
  mytext,
  isAcceptablePath,
  parseAny,
}
