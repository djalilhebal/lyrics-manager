const cheerio = require('cheerio');
const Song = require('./Song.js');

function /** boolean */ accepts(/** string */ path) {
  return path.startsWith('https://genius.com/') || path.endsWith('Genius Lyrics.html');
}

function /* Song */ parse(/** string */ path, /** string */ html) {
  const [, rawData] = html.match(/var TRACKING_DATA = (\{.+?\});/);
  const data = JSON.parse(rawData);
  const [title, artist, album] =
    ['Title', 'Primary Artist', 'Primary Album'].map(prop => data[prop]);

  const $ = cheerio.load(html);
  // preserve line breaks
  $('.lyrics br').text('\n');
  const lyrics = $('.lyrics').text();
  
  return new Song({title, lyrics, artist, album});
}

module.exports = {
  accepts,
  parse
}
