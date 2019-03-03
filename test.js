const fs = require('fs');
const test = require('tape');
const LyricsManager = require('./src');

/**
 * `y` is a `goodEnoughObj` if it has all of x's keys/vals
 *
 * @param {Object} x
 * @param {Object} y
 * @returns {boolean}
 * 
 * @example
 * goodEnoughObj({name: 'Alice'}, {name: 'Alice', real: false}) === true;
 * goodEnoughObj({name: 'Alice'}, {}) === false;
 */
const goodEnoughObj = (x, y) => Object.keys(x).every(key => x[key] === y[key]);

const read = x => fs.readFileSync(x, 'utf8');

// PARSER

const {getOriginalLink, genius, azlyrics, darklyrics, any} = LyricsManager;

test('Extracting URLs from HTML', (t) => {
  const html = '<!DOCTYPE html>' +
  '<!-- saved from url=(0047)https://genius.com/Tal-le-sens-de-la-vie-lyrics -->' +
  '<html ...';
  t.equal(getOriginalLink(html), 'https://genius.com/Tal-le-sens-de-la-vie-lyrics');
  t.end();
});

test('Parsing Genius Lyrics pages', (t) => {
  const path = './sample/Dionysos – La panique mécanique Lyrics _ Genius Lyrics.html';
  const content = read(path);
  const result = genius.parse(path, content).getObj();
  const expected = {
    artist: 'Dionysos',
    album: 'La Mécanique Du Cœur',
    title: 'La Panique Mécanique',
  }

  t.ok(goodEnoughObj(expected, result), 'Song object contains wanted info');
  t.ok(result.lyrics.length > 0, 'The lyrics prop should not be empty');
  t.end();
});

test('Parsing AZLyrics pages', (t) => {
  const path = './sample/Simple Plan Lyrics - This Song Saved My Life.html';
  const content = read(path);
  const link = getOriginalLink(content);
  const result = azlyrics.parse(link, content).getObj();
  const expected = {
    artist: 'Simple Plan',
    title: 'This Song Saved My Life',
    // album: 'Get Your Heart On!',
  }
  
  t.ok(goodEnoughObj(expected, result), 'Song object contains wanted info');
  t.ok(result.lyrics.startsWith('I wanna start by letting you know this'), 'lyrics');
  t.end();
});

test('Parsing DarkLyrics pages', (t) => {
  const path = './sample/TRIVIUM LYRICS - _Silence In The Snow_ (2015) album.html';
  const content = read(path);
  const link = getOriginalLink(content);
  const result = darklyrics.parse(link, content);
  const myFavSong = result.find(song => song.getObj().title === 'Pull Me From The Void');
  t.ok(!!myFavSong, 'has my a wanted song');
  t.end();
});

test('parser.any accepts any *acceptable* file/link', (t) => {
  const paths = [
    'http://www.darklyrics.com/lyrics/trivium/silenceinthesnow.html#4',
    './darklyrics_Trivium/TRIVIUM LYRICS - _Silence In The Snow_ (2015) album.html',
    
    'https://genius.com/Tal-le-sens-de-la-vie-lyrics',
    //'./Genius_Tal/Le Droit de rever/' + 
    // 'Tal – Le sens de la vie Lyrics _ Genius Lyrics_files.html',
    
    'https://www.azlyrics.com/lyrics/simpleplan/thissongsavedmylife.html',
    './azlyrics_Simple Plan/Get Your Heart On!/' +
      'Simple Plan Lyrics - This Song Saved My Life.html',
  ];

  paths.forEach((path) => {
    t.ok(any.accepts(path), 'accepts: ' + path);
  });

  t.end();
});

// EXPORTER

const {Song, LyricsDatabase, saveZip, saveHtml} = LyricsManager;

// fake data
const song = new Song({
  title: 'iRobot',
  artist: 'Jon Bellion',
  album: 'The Human Condition',
  lyrics: 'I am a robot...',
});
let db = new LyricsDatabase();
db.addSong(song);

test('Exporting HTML', (t) => {
  const file = 'lyrics-test.html';
  saveHtml(db, file, 1);
  t.ok(fs.existsSync(file), 'creates file');

  const html = db.getHtml(1);
  t.ok(html.includes('Jon Bellion</a>'), 'creates jump links');
  t.ok(html.includes('<h2>The Human Condition</h2>'), 'creates headings for albums');
  t.end();
});

test('Exporting valid JSON', (t) => {
  try {
    const json = db.getJson();
    const parsed = JSON.parse(json);
    t.pass('Parsing exported JSON did not throw');
  } catch (e) {
    t.fail('Error parsing exported JSON');
  }
  
  t.end();
});

test('Saving exported zip', (t) => {
  const zip = 'test-lyrics.zip';
  saveZip(db, zip);
  t.ok(fs.existsSync(zip), 'creates file');
  t.end();
});
