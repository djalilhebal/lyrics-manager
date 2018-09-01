const azlyrics = require('./parse.azlyrics.js');
const darklyrics = require('./parse.darklyrics.js');
const mytext = require('./parse.mytext.js');

const supported = [azlyrics, darklyrics, mytext];

function isAcceptablePath(p) {
  return supported.some( x => x.accepts(p));
}

function parseAny(path, content) {
  if (!isAcceptablePath(path) || !content || !content.length) {
    console.log(`unaccaptable input:\n  path: ${path}\n  content: ${content}`);
    return [];
  }
  
  try {
  for ( i = 0; i < supported.length; i++) {
    if (supported[i].accepts(path)) {
      const result = supported[i].parse(path, content);
      // the main script expects an array of songs/objects
      if (Array.isArray(result))
        return result;
      else 
        return [result];
    }
  }
  }catch(e){console.log(e, path, content)}
}

module.exports = {
  azlyrics,
  darklyrics,
  mytext,
  isAcceptablePath,
  parseAny,
}
