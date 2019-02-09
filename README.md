# Lyrics Manager
[WIP]
This is not a scrapper/crawler (still, it can be incorporated into one), but a lyrics parser for personal uses.

## Supported

* azlyrics
* darklyrics
* mytext (JSON + text) and plain text

## Installation
- Make sure [nodejs](https://nodejs.org) is installed, then run:

```sh
npm install dreamski21/lyrics-manager -g
```

## API
### Song
`.setTitle/Lyrics/Artist/Album/Year/Number()`

`.isUsable()` True if `title` and `lyrics` and `artist` are all set.

`.getObj()` return an Object with all the Song's properties:
```javascript
{
      "title": "Asking for It",
      "lyrics": "Can I have a moment of your time? ...",
      "artist": "Shinedown",
      "number": 1, // 1-13 - Track number
      "album": "Threat To Survival",
      "year": 2015, // album's release
}
```

### LyricsDatabase
Basically a `Map` of `Map`s of `Object`s

`.addSong(/** Song */ x)`

`.getHtml(headingLevel)` export the database to an HTML file

`.getZip()` export the database to a zip file

### Manager
`Manager.parseDir(root)` traverses a directory and parses its 'acceptable' files.

`Manager.parseAny(path, content)`
path can be a URL or a file path.

Examples:
```javascript
parseAny('https://www.azlyrics.com/lyrics/cascada/aneverendingdream.html', content);
/* returns:
{
  artist: "Cascada",
  album: "Everytime We Touch",
  title: "A Neverending Dream",
  lyrics: "..."
}
*/

parseAny('./azlyrics_Falling In Reverse/Fashionably Late/Falling In Reverse Lyrics - Alone.html', content)
/* returns:
{
  artist: "Falling In Reverse",
  album: "Fashionably Late",
  title: "Alone",
  lyrics: "..."
}
*/

```

## TODO
Genuis: document.querySelector('lyrics').innerText
var TRACKING_DATA = {...};

- `LyricsDatabase.getJson()` (JSON.stringify doesn't work on `Map`s)

- Instead of importing/exporting JSON files, why not use `nedb`?
(basically a non-SQL JSON database for small projects)

- `LyricsDatabase.search(query)`
*"And what is the use of a database," thought Malice, "without searches or queries?"*

- Add CLI a parameter like: --template "artist/[year] album/song.txt" (or ".lrc")

## Known issues
**It accepts files that shouldn't be accepted.**

Currently it ignores them if errors occur while parsing.

Workaround: Improve the whitelist regex or add a blacklist regex.

**Zipped files with non-ASCII characters in their names are 'ruined'**

For example, `Tal/A L'infini/Le Passé` becomes `Tal/A L'infini/Le Pass├⌐.tx`

7-zip can neither read nor extract them.

Fixes:
- iconv (UTF8/UTF18 to ASCII), romanize("Le Passé") == "Le Passe"
- The awesome `adm-zip` module is probably the problem, as 7-zip correctly processes .zip files with Unicode names. So just use a different module (?)

**HTML escape sequences**

For example: "Black &amp; Blue" should be "Black & Blue"

Fixes:
- Unescape them, obviously

## License
CC0
