const program = require('commander');

const LyricsDatabase = require('./src/LyricsDatabase.js');
const {print, parseDir, exportHtml, exportZip} = require('./src/manager.js');

const HELP = `
USAGE: lyrics-manager --dir <path> --zip <path> --html <path> --level <NUMBER>
levels:
  0 don't create any content index (Default)
  1 create artists index
  2 create artists-albums index
  3 create artists-albums-songs index

EXAMPLE: lyrics-manager --dir songs-lyrics --zip lyrics-all.zip --html lyrics-all.html --level 3
`

program
  .version('0.0.0')
  .option('--dir <path>', 'Directory to import')
  .option('--zip <path>', 'Export to zip')
  .option('--html <path>', 'Export to HTML')
  .option('--level <level>', 'HTML heading level (0-3)')
  .parse(process.argv)

const {dir, zip, html, level} = program;

if (dir && (zip || html)) {
	const db = new LyricsDatabase();
	parseDir(db, dir);
	if (zip) exportZip(db, zip);
	if (html) exportHtml(db, html, Number(level));
} else {
	print(HELP);
}
