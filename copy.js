const { readFileSync, writeFileSync } = require('fs');

const target = readFileSync('./README.md', { encoding: 'utf-8' });

writeFileSync('./index.md', target, { encoding: 'utf-8' });
