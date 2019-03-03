const Song = require('./Song.js');

// file: `darklyrics_Trivium/TRIVIUM LYRICS - _Silence In The Snow_ (2015) album.html`
// file: `darklyrics_Suicide Silence/SUICIDE SILENCE LYRICS - _Suicide Silence_ (2005) EP.html`
// pattern: `darklyrics_ARTIST/ARTIST LYRICS - _ALBUMNAME_ (YEAR) album/EP.html`
const rDarklyricsFile = /darklyrics_(.+)\/\1 LYRICS - _(.+)_ (\(\d+\)) (album|EP)\.html$/i;

// url: `http://www.darklyrics.com/lyrics/suicidesilence/suicidesilence.html`
// pattern: `http://www.darklyrics.com/lyrics/ARTIRST/ALBUM.html`
const rDarklyricsUrl = /^http:\/\/www.darklyrics\.com\/lyrics\/(.+)\/(.+)\.html(#.*)?$/

function accepts(path) {
  return rDarklyricsFile.test(path) || rDarklyricsUrl.test(path);
}

function /** Array<Song> */ parse(path, html) {
  // <title>ASKING ALEXANDRIA LYRICS - "Reckless And Relentless" (2011)</title>
  // <title>ARTIST LYRICS - "ALBUM" (YEAR) album/EP</title>
  const rTitle = /.*?<title>(.+?) LYRICS - "(.+)" \((\d+)\) (album|EP)<\/title>/
  
  const [, artist, album, year] = html.match(rTitle);
  
  // The HTML portion we're interested in, looks like this:
  /*
  <div class="lyrics">
  <h3><a name="1">1. Snøfall</a></h3><br>
  <i>[Instrumental]</i><br><br><br><br>
  [...]
  <h3><a name="{N}">{N}. {SONG}</a></h3><br>
  {LYRICS}
  <br><br>

  <br><div class="thanks">[...]
  */
  const DIV_LYRICS = '<div class="lyrics">';
  const DIV_THANKS = '<div class="thanks">';
  const lyricsDiv = html.split(DIV_LYRICS)[1].split(DIV_THANKS)[0];

  const songsDivs = lyricsDiv.split('<h3>');
  songsDivs.shift(); // the first element is an empty string, omit it
  const songs = songsDivs.map( (songHtml) => {
    // <a name="{N}">{N}. {TITLE}</a></h3><br>{LYRICS}
    const rSongInfo = /<a name="\d+">(\d+)\. (.+?)<\/a><\/h3><br>/;
    const [, number, title] = songHtml.match(rSongInfo);
    const lyrics = songHtml
      .replace(rSongInfo, '')
      // remove italics and HTML line-breakers
      .replace(/<br>|<i>|<\/i>/g, '')
      .trim();

    return new Song({title, lyrics, artist, album, year, number});
  });
  
  return songs;
}

module.exports = {
  accepts,
  parse
}
