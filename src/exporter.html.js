function generateHtml(database, /** string */ headingLevel) {
  const uniqueCode = (function(){
    let seed = 0;
    return function(){
      return (seed++).toString(36)
    }
  })();

  function generateHeading(str, lvl, style = '') { // 'b', 'i', ''
    let heading = `<h${lvl}>${str}</h${lvl}>`
    if (headingLevel >= lvl) {
      const id = uniqueCode();
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
  
  const list_part = _list.length ? `<h1>CONTENTS</h1>${_list.join('\n')}<br>` : '';
  const body_part = _body.join('\n');
  const result =
  `<!DOCTYPE html>
  <html>
    <head>
      <title>Exported Lyrics</title>
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

module.exports = generateHtml;
