const exporter = require('./LyricsDatabase.export.js');
const Song = require('./Song.js');

class LyricsDatabase {
  constructor() {
    this._db = new Map(); // underscore indicates it's private
  }
  
  /** boolean */ addSong(/** Song */ x) {
    if (!(x instanceof Song) || !x.isUsable()) return false;

    const {artist, album, title, lyrics} = x.getObj();
  
    const db = this._db;
    
    if (!db.has(artist)) db.set(artist, new Map());
    const artistMap = db.get(artist);

    if (!artistMap.has(album)) artistMap.set(album, new Map());
    const albumMap = artistMap.get(album);

    albumMap.set(title, {lyrics});

    return true; // indicates the song was successfully added.
  }
  
  /** Map */ getMap() {
    return this._db;
  }

  /** Buffer */ getZip() {
    return exporter.generateZip(this.getMap());
  }

  /** string */ getHtml(/** number */ headingLevel = 3) {
    return exporter.generateHtml(this.getMap(), headingLevel);
  }

}

module.exports = LyricsDatabase;
