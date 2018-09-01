/**
 * 2018-06 -- shine
 * basically it's shinedown-words.js (2018-05), but at least it does something useful...
 * Extract lyrics from saved pages (organized in directories/"artists" and subdirectories/"albums")
 * and save everything in one folder `./txts/`
 *
 * EXAMPLE
 * file: `Shinedown/lyrics_ATTENTION ATTENTION/Shinedown Lyrics - EVOLVE.html`
 * becomes: `txts/Shinedown - EVOLVE.txt`
 *
 */

const fs = require('fs');
const glob = require('glob');

function getInfo(path) {
  // "Shinedown/lyrics_ATTENTION ATTENTION/Shinedown Lyrics - EVOLVE.html"
  // {artist: 'Shinedown', album: 'ATTENTION ATTENTION', song: 'EVOLVE'}
  const parts = path.split('/');
  const output = {
    artist: parts[0],
    album: parts[1].slice('lyrics_'.length),
    song: parts[2].slice('Shinedown Lyrics - '.length).slice(0, - '.html'.length),
  }
  return output;
}

function extractLyrics(html) {
  // no need for 'cheerio'/selectors this time, we know where to find our element
  // ...<div>{COMMENT}{rawLyrics}</div>...
  const COMMENT = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->';
  const rawLyrics = html.split(COMMENT)[1].split('</div>')[0];
  // remove HTML tags and extra spaces/newlines
  const lyrics = rawLyrics.replace(/<br>/g, '').replace(/<\/?i>/g, '').trim();
  return lyrics;
}

// 'Shinedown/*/*' contains all entries saved from azlyrics.com/s/shinedown.html
const paths = glob.sync('Shinedown/*/*.html');
const infos = paths.map( getInfo );
const htmls = paths.map( path => fs.readFileSync(path, 'utf8') );
const texts = htmls.map( extractLyrics );

paths.forEach( (path, i) => {
  const info = infos[i];
  const text = texts[i];//${info.artist}\t${info.album}\t${info.song}
  const output = `${JSON.stringify(info)}\n\n${text}\n`;
  const filename = `${info.artist} - ${info.song}.txt`;
  fs.writeFileSync('txts/'+filename, output);
});
