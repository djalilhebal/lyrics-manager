// Shinedown's Words (2018-05-20)
// creates a list of all words used in Shinedown's lyrics, sorted by their frequency.
// I know it's #ungood: it doesn't handle errors, contractions, stopwords, word variations (singular/plural, same verb in diff tenses, etc.)

const fs = require('fs');
const glob = require('glob');

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
const htmls = paths.map( path => fs.readFileSync(path, 'utf8') );
const texts = htmls.map( extractLyrics );

const words = {};
texts
  .join('\n')
  .toLowerCase()
  .replace(/[^a-z\s-]/g, '')
  .split(/\s+/)
  .forEach( (word) => {
    if( !words[word] ) words[word] = 0;
    words[word]++;
  });

const output =
  Object.keys(words)
  .sort( (a, b) => words[b] - words[a])
  .map( word => `${word} (${words[word]})`)
  .join('\n');
  
fs.writeFileSync('shinedown-words.txt', output);
