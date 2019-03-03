const AdmZip = require('adm-zip');

function generateZip(database) {
  // On Windows these characters are reserved: \ / : * ? " < > |
  const rReserved = /[\/:*?"<>|]/g
  const namify = (str) => (str).replace(rReserved, '_');
  
  const zip = new AdmZip();
  
  database.forEach( (artist, artistName) => {
    artist.forEach( (album, albumName) => {
      album.forEach( (song, songTitle) => {
        const path = [artistName, albumName, songTitle].map(namify).join('/') + '.txt';
        zip.addFile(path, Buffer.alloc(song.lyrics.length, song.lyrics));
      });
    });
  });
  
  return zip;
}

module.exports = generateZip;
