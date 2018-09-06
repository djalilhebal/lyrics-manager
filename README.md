# Lyrics Manager
[INCOMPLETE] [WIP]
This is not a scrapper/crawler (still, it can be incorporated into one), but a lyrics parser for personal uses.

## Supported

* azlyrics
* darklyrics
* mytext (JSON + text) and plain text

## Installation
- Make sure [nodejs](https://nodejs.org) is installed

- Download or clone this repo (`git clone https://github.com/dreamski21/lyrics-manager.git`)

- run:
```sh
cd lyrics-manager
npm install -g
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
- `LyricsDatabase.getJson()` (JSON.stringify doesn't work on `Map`s)

- `LyricsDatabase.importJson()` imports a previously exported JSON DB, duh

- Instead of importing/exporting JSON files, why not use `nedb`?
(basically a non-SQL JSON database for small projects)

- `LyricsDatabase.search(query)`
*"And what is the use of a database," thought Malice, "without searches or queries?"*

## Known issues
**It accepts files that shouldn't be accepted.**

Currently it ignores them when errors occur while parsing.

Fixes:
- Improve the whitelist regex, or
- Add a blacklist regex

**Zipped files with non-ASCII characters in their names are *ruined***

Example:
- `Tal/A L'infini/Le Passé` -> `Tal/A L'infini/Le Pass├⌐.tx`
- `Snøfall.txt` -> `Sn├╕fall.tx`

7-zip can neither read nor extract them.

Fixes:
- iconv (UTF8/UTF18 to ASCII), romanize("Passé/Snøfall") == "Passe/Snofall"
- The awesome `adm-zip` module is probably the problem, as 7-zip correctly processes .zip files with Unicode names.
Just use a different module (?)

**HTML escape sequences**

For example: "Black &amp; Blue" should be "Black & Blue"

Fixes:
- Unescape them, obviously

## License
CC0
