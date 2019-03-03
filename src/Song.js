class Song {
  
  constructor(obj = {}) {
    this._obj = {
      title: null,
      lyrics: null,
      artist: null,
      number: null,
      album: null,
      year: null,
    };
    
    Object.assign(this._obj, obj);
    this.normalizeAll();
  }
  
  getObj() {
    return this._obj;
  }

  //  The `title`, `lyrics`, `album`, and `artist` attributes are required
  //  If they exist, this `Song` is usable and can be returned for further processing
  /** boolean */ isUsable() {
    return this._obj.title && this._obj.lyrics && this._obj.album && this._obj.artist;
  }

  normalizeAll() {
    //TODO complete and simplify
    this._obj.artist = this.normalizeName(this._obj.artist);
    this._obj.album = this.normalizeName(this._obj.album) || 'undefined';
    this._obj.title = this.normalizeName(this._obj.title);
    this._obj.lyrics = this._goodString(this._obj.lyrics);
  }

  setTitle(/** string */ val) {
    this._obj.title = this.normalizeName(val);
  }

  setLyrics(/** string */ val) {
    this._obj.lyrics = this._goodString(val);
  }

  setArtist(/** string */ val) {
    this._obj.artist = this.normalizeName(val);
  }

  setAlbum(/** string */ val) {
    this._obj.album = this.normalizeName(val);
  }

  setYear(/** number */ val) {
    this._obj.year = Number(val);
  }

  setNumber(/** number */ val) {
    this._obj.number = Number(val);
  }
  
  /** string */ normalizeName(/** string */ str) {
    //TODO: deentitify: str.replace(/&amp;/g, '&');
    //Example: 'Black &amp; Blue' > 'Black & Blue'
    if (!this._goodString(str)) return '';
    
    return str // 'ASKING ALEXANDRIA'
      .trim()
      .toLowerCase() // 'asking alexandria'
      .split(/\s+/) // ['asking', 'alexandria']
      .map( x => x[0].toUpperCase() + x.slice(1)) // ['Asking', 'Alexandria']
      .join(' ') // 'Asking Alexandria'
  }
  
  _goodString(str) {
    if (typeof str === 'string') {
      return str.trim();
    } else {
      return '';
    }
  }
  
}

module.exports = Song;
