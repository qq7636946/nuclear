const fs = require('fs');
const path = 'd:\\nuclear\\index.html';

let content = fs.readFileSync(path, 'utf8');

// Regex to find img tags without loading="lazy"
// This is a simple regex assumption, may need adjustment for existing attributes
content = content.replace(/<img((?!loading="lazy")[^>]+)>/gi, (match) => {
    if (match.includes('loading=')) return match; // Already has loading
    return match.replace('<img', '<img loading="lazy"');
});

fs.writeFileSync(path, content);
console.log('Added lazy loading to images.');
