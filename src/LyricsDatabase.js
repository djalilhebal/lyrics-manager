const exporter = require('./exporter.js');
const Song = require('./Song.js');

class LyricsDatabase {
  constructor() {
    this._db = new Map();
  }
  
  /// @returns {boolean} indicates whether the song was successfully added or not
  addSong(/** Song */ x) {
    if (x instanceof Song && x.isUsable()) {
      const obj = x.getObj();
      const {artist, album, title} = obj;
    
      if (!this._db.has(artist)) this._db.set(artist, new Map());
      const artistMap = this._db.get(artist);

      if (!artistMap.has(album)) artistMap.set(album, new Map());
      const albumMap = artistMap.get(album);

      albumMap.set(title, obj);

      return true;
      
    } else {
      console.warn('Song was not added to db', x);
      return false;
    }
    
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

  /** string */ getJson() {
    return exporter.generateJson(this.getMap());
  }
  
}

module.exports = LyricsDatabase;
