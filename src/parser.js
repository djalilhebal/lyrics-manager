const azlyrics = require('./parser.azlyrics.js');
const darklyrics = require('./parser.darklyrics.js');
const genius = require('./parser.genius.js');
const mytext = require('./parser.mytext.js');

const any = {
  /** boolean */ accepts(/** path */ path) {
    return !!this.getParser(path);
  },
  parse(/** string */ path, /** string */ content) {
    return this.getParser()(path, content);
  },
  supported: [azlyrics, darklyrics, genius, mytext],
  getParser(/** string */ path) {
    const found = this.supported.find(x => x.accepts(path));
    return found? found.parse : undefined;
  },
}

// Just an utility function.
//TODO Google Chrome saves pages like this. Do other browsers do that?
//TODO rename it?
function /** string */ getOriginalLink(/** string */ html) {
  const [, link] = html.match(/<!-- saved from url=\(\d+\)(.+?) -->/) || [];
  return link? link : '';
}

module.exports = {
  any,
  azlyrics,
  darklyrics,
  genius,
  mytext,
  getOriginalLink,
}
