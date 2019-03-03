const program = require('commander');

const {LyricsDatabase, loadDir, exportHtml, exportZip} = require('./src/');
const print = console.info;

const HELP = `
USAGE: lyrics-manager --dir <path> --zip <path> --html <path> --level <number>
LEVELS (for html):
  0 - Don't create any contents table (Default)
  1 - Create artists index
  2 - Create artists-albums index
  3 - Create artists-albums-songs index

EXAMPLE: lyrics-manager --dir ./songs-extra/#lyrics/ --zip lyrics-all.zip
`

program
  .version('0.0.2')
  .option('--dir <path>', 'Directory to import')
  .option('--zip <path>', 'Export to zip')
  .option('--html <path>', 'Export to HTML')
  .option('--level <level>', 'HTML heading level (0-3)')
  .parse(process.argv);

const {dir, zip, html, level} = program;

if (dir && (zip || html)) {
	const db = new LyricsDatabase();
	loadDir(db, dir);
	if (zip) exportZip(db, zip);
	if (html) exportHtml(db, html, Number(level));
} else {
	print(HELP);
}
