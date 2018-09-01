const exporter = require('./LyricsDatabase.export.js');
const Song = require('./Song.js');

class LyricsDatabase {
  constructor() {
    this._db = new Map(); // underscore indicates it's private
  }
  
  addSong(x) {
    if (!(x instanceof Song) || !x.isUsable()) return;

    const {artist, album, title, lyrics} = x.getObj();
    //title = title.replace(/&amp;/g, '&'); // Black &amp; Blue -> Black & Blue
  
    const db = this._db;
    
    if (!db.has(artist)) db.set(artist, new Map())
    const artistMap = db.get(artist);

    if (!artistMap.has(album)) artistMap.set(album, new Map())
    const albumMap = artistMap.get(album);

    albumMap.set(title, {lyrics});
  }
  
  getHtml(headingLevel = 3) {
    return exporter.generateHtml(this._db, headingLevel);
  }
  
  getZip() {
    return exporter.generateZip(this._db);
  }

}

module.exports = LyricsDatabase;
