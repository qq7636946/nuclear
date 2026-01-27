const fs = require('fs');
const path = 'd:\\nuclear\\index.html';
const outPath = 'd:\\nuclear\\css\\home-inline.css';

const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
let inStyle = false;
let styleContent = [];
let newHtmlLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().includes('<style>')) {
        inStyle = true;
        newHtmlLines.push('    <link rel="stylesheet" href="css/home-inline.css">');
        continue;
    }
    if (line.trim().includes('</style>')) {
        inStyle = false;
        continue;
    }
    if (inStyle) {
        styleContent.push(line);
    } else {
        newHtmlLines.push(line);
    }
}

fs.writeFileSync(outPath, styleContent.join('\n'));
fs.writeFileSync(path, newHtmlLines.join('\n'));
console.log('Extracted ' + styleContent.length + ' lines of CSS.');
