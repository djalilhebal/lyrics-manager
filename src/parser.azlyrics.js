const Song = require('./Song.js');

// url: https://www.azlyrics.com/lyrics/cascada/aneverendingdream.html
const rAzlyricsUrl = /^https:\/\/www\.azlyrics\.com\/lyrics\/(.+)\/(.+)\.html$/

// pattern: `azlyrics_ARTIST/ALBUM/ARTIST - TITLE Lyrics _ AZLyrics.com.html`
const rAzlyricsFile = /azlyrics_(.+?)\/(.+?)\/\1 - (.+) Lyrics _ AZLyrics\.com\.html$/

// path: `azlyrics_Cinema Bizarre/Toyz/Cinema Bizarre Lyrics - In Your Cage.html`
// pattern: `azlyrics_ARTIST/ALBUM/ARTIST Lyrics - TITLE.html`
const rAzlyricsFileOld = /azlyrics_(.+?)\/(.+?)\/\1 Lyrics - (.+)\.html$/

function accepts(path) {
  return rAzlyricsFile.test(path) || rAzlyricsUrl.test(path);
}

function /** Song */ parse(path, html) {
  function getLyrics() {
    // lyrics text (rawLyrics) can be found immediately after the comment:
    // ...<div>{COMMENT}{rawLyrics}</div>...
    const COMMENT = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->';
    const rawLyrics = html.split(COMMENT)[1].split('</div>')[0];
    // remove HTML tags and extra spaces/newlines
    const lyrics = rawLyrics.replace(/<br>|<i>|<\/i>/g, '').trim();
    return lyrics;
  }

  function getInfo() {
    if (rAzlyricsFile.test(path)) {
      const [, artist, album, title] = path.match(rAzlyricsFile);  
      return { artist, album, title };
    } else {
      // <title>Cascada Lyrics - A Neverending Dream</title>
      const rTitle = /.+?<title>(.+) Lyrics - (.+)<\/title>/
      // album: <b>"Everytime We Touch"</b> (2006)<br><br>
      const rAlbum = /album: <b>"(.+)"<\/b> \((\d+)\)<br><br>/
  
      const [, artist, title] = html.match(rTitle);
      const [, album, year] = html.match(rAlbum) || [];
      return {artist, album, title, year}
    }
  }
  
  const x = new Song();
  
  try {
    const info = getInfo();
    const lyrics = getLyrics();
    x.setLyrics(lyrics);
    x.setArtist(info.artist);
    x.setAlbum(info.album);
    x.setTitle(info.title);
    x.setYear(info.year);
  } catch (e) {}

  return x;
}

module.exports = {
  accepts,
  parse
}
