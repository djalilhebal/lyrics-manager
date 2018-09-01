/*
database {
  artist {
    album {
      song {
        lyrics: string
        }
      }
    }
}
*/

const AdmZip = require('adm-zip');

function generateZip(database) {
  // On Windows these characters are reserved: \ / : * ? " < > |
  const rReserved = /[\/:*?"<>|]/g
  const namify = (str) => (str).replace(rReserved, '_');
  
  const zip = new AdmZip();
  
  database.forEach( (artist, artistName) => {
    artist.forEach( (album, albumName) => {
      album.forEach( (song, songTitle) => {
        const path = [artistName, albumName, songTitle].map(namify).join('/') + '.txt'
        zip.addFile(path, Buffer.alloc(song.lyrics.length, song.lyrics));
      })
    })
  })
  
  return zip;
}

//***********************************************

function Identifier() {
  let seed = 0;
  return {
    newId: () => (seed++).toString(36),
  }
}
  
function generateHtml(database, headingLevel) {
  const identifier = Identifier();

  function generateHeading(str, lvl, style = '') { // 'b', 'i', ''
    let heading = `<h${lvl}>${str}</h${lvl}>`
    if (headingLevel >= lvl) {
    id = identifier.newId();
    let indexHeading = `${'    '.repeat(lvl)}<a href="#${id}">${str}</a>`;
    if (style === 'b' || style === 'i') {
      indexHeading = `<${style}>${indexHeading}</${style}>`
    }
    _list.push(indexHeading);
    
    heading = heading.replace('>', ` id=${id}>`);
    }
    return heading;
  }
  
  const _list = []; // list of contents; links to jump to actual content
  const _body = [];

  database.forEach( (artist, artistName) => {
    _body.push(generateHeading(artistName, 1, 'b'));
     
    artist.forEach( (album, albumName) => {
      _body.push(generateHeading(albumName, 2, ''));
        
      album.forEach( (song, songTitle) => {
        const heading = generateHeading(songTitle, 3, 'i');
        _body.push(`${heading}${song.lyrics}`);
      })
    })
  });
  
  const list_part = _list.length ? `<h1>CONTENT</h1>${_list.join('\n')}<br>` : '';
  const body_part = _body.join('\n');
  const result =
  `<html>
    <head>
      <title>LYRICS</title>
      <style>
      body { white-space: pre-wrap;}
      </style>
    </head>
    <body>
      ${list_part}
      ${body_part}
    </body>
  </html>`
  
  return result;
}

module.exports = {
  generateZip,
  generateHtml,
}
