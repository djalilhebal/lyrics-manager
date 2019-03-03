# Lyrics Manager
Manages/extracts/exports saved lyrics (HTML) pages. *WIP*

This is not a scrapper/crawler (still, it can be incorporated into one), but a lyrics parser for personal uses.

## Supported
Basically these are the websites I use:
* AZLyrics
* DarkLyrics
* Genius Lyrics
* In addition to MyText (JSON + text or just plain text)

## Installation
Make sure [nodejs](https://nodejs.org) is installed, then run:

```sh
npm install dreamski21/lyrics-manager -g
```

## API
An example that parses a page saved from AZLyrics, adds it to to a newly created LyricsDatabase, then exports the database as zip and json files.
```js
const fs = require('fs');
const {LyricsDatabase, any, saveZip} = require('lyrics-manager');

const file = '#lyrics/azlyrics_Cinema Bizarre/Toyz/Cinema Bizarre Lyrics - In Your Cage.html';
const content = fs.readFileSync(file);
const song = any.parse(file, content);

const db = new LyricsDatabase();
db.addSong(song);

saveZip(db, 'db.zip');
fs.writeFileSync(db.getJson(), 'db.json', 'utf8');
```

### General
*LyricsManager* exports:

`loadDir(db, root)` traverses a directory and parses its 'acceptable' files and adds them to `db`.

And these objects: `genius`, `azlyrics`, `darklyrics`, `mytext`, and `any`. Each of these "interfaces" has two methods: `accepts(path)` and `parse(path, content)`.

Examples:
```javascript
let song;

let path = 'https://www.azlyrics.com/lyrics/cascada/aneverendingdream.html';
if (azlyrics.accepts(path)) {
  // const html = fetch path/link
  song = azlyrics.parse(path, html);
  song.getObj();
  /*
  {
    artist: "Cascada",
    album: "Everytime We Touch",
    title: "A Neverending Dream",
    lyrics: "..."
  }
  */
}

path = './azlyrics_Falling In Reverse/Fashionably Late/Falling In Reverse Lyrics - Alone.html';
if (any.accepts(path)) {
  // const content = read path/file
  song = any.parse(path, content);
  song.getObj();
  /*
  {
    artist: "Falling In Reverse",
    album: "Fashionably Late",
    title: "Alone",
    lyrics: "..."
  }
  */
} 
```

### Song
`.isUsable()` True if `title` and `lyrics` and `artist` are all set.

`.getObj()` returns an Object with all the Song's properties:
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

`.setTitle/Lyrics/Artist/Album/Year/Number()`

### LyricsDatabase
Basically a `Map` of `Map`s of `Object`s of the form:
```
database {
  artist {
    album {
      song {
        lyrics: string
      }
    }
  }
}
```

* `.addSong(/** Song */ x)`

* Exporting:
  - `.getMap()`
  - `.getJson(space = true)`
  - `.getZip()` export the database to as a zip buffer
  - `.getHtml(headingLevel)` export the database as HTML with a multi-level (artists/albums/songs) table of content.

## TODO
- Read MHTML files

- Add a CLI parameter that changes exported files' paths, something like: `--template "artist/[year] album/song.txt"` (or ".lrc")

- `LyricsDatabase.search(query)`
*"And what is the use of a database," thought Malice, "without searches or queries?"*
Add a `code` and `name` attributes to all parsers.
e.g. `{code: 'genius', name: 'Genius Lyrics', accepts, parse}`

- `LyricsDatabase.forEachSong(fn)` would be a utility function that *exporters* use.

- HTML: prefix in ids? "0" vs "x-0"

## Known issues
**It accepts some files that shouldn't be accepted.**

Currently it ignores them if errors occur while parsing.

Workaround: Improve the whitelist regex or add a blacklist regex.

**Zipped files with non-ASCII characters in their names are 'ruined'**

For example, `Tal/A L'infini/Le Passé.txt` becomes `Tal/A L'infini/Le Pass├⌐.tx`

7-zip can neither read nor extract them.

Fixes:
- iconv (UTF8/UTF18 to ASCII), romanize("Le Passé") == "Le Passe"
- The awesome `adm-zip` module is probably the problem, as 7-zip correctly processes .zip files with Unicode names. So just use a different module..?

**HTML escape sequences**

For example: "Black &amp; Blue" should be "Black & Blue"

Fixes:
- Unescape them, obviously


**parsers' output is inconsistent** It's either `Song` or `Array<Song>` (darklyrics)

Make everything return an array of songs even if its length is 1?


**Normalizing names return unwanted results.**
```text
ATTENTION ATTENTION > Attention Attention
La panique mécanique > La Panique Mécanique
iRobot > Irobot
```

The original names are correct most of the time. Just stop try to fix them?


## License
CC0
