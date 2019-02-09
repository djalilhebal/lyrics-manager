class Song {
  constructor() {
    this._obj = {
      title: null,
      lyrics: null,
      artist: null,
      number: null,
      album: null,
      year: null,
    };
  }
  
  stringOrNull(str) {
    if (typeof str !== 'string' || !str.length) {
      // TODO: print call stack
      console.log(`Expected a non-empty string, instead get: ${str}`);
      return null;
    }
    return str;
  }
  
  /** string */ normalizeName(str) {
    // TODO: str.replace(/&amp;/g, '&'); // Black &amp; Blue -> Black & Blue
    if (!this.stringOrNull(str)) return '';
    
    return str // 'ASKING ALEXANDRIA'
    .trim()
    .toLowerCase() // 'asking alexandria'
    .split(/\s+/) // ['asking', 'alexandria']
    .map( x => x[0].toUpperCase() + x.slice(1)) // ['Asking', 'Alexandria']
    .join(' ') // 'Asking Alexandria'
  }

  setTitle(val) {
    this._obj.title = this.normalizeName(val);
  }

  setLyrics(val) {
    this._obj.lyrics = this.stringOrNull(val);
  }

  setArtist(val) {
    this._obj.artist = this.normalizeName(val);
  }

  setAlbum(val) {
    this._obj.album = this.normalizeName(val);
  }

  setYear(val) {
    this._obj.year = Number(val);
  }

  setNumber(val) {
    this._obj.number = Number(val);
  }
  
  isUsable() {
    // `title`, `lyrics`, and `artist` are required
    // if they exist, this `Song` is usable, return it for further processing
    if (this._obj.title && this._obj.lyrics && this._obj.artist) {
      return this.getObj();
    } else {
      return null;
    }
  }
  
  getObj() {
    return this._obj;
  }
}

module.exports = Song;
