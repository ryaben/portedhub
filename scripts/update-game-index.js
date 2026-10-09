const fs = require('fs');
const path = require('path');

const libraryDir = path.join(__dirname, '../public/games');
const indexPath = path.join(libraryDir, 'index.json');

const portFolders = fs.readdirSync(libraryDir)
  .filter(file => {
    const filePath = path.join(libraryDir, file);
    return fs.statSync(filePath).isDirectory() && file !== 'node_modules';
  })
  .sort();

// Write to index.json
fs.writeFileSync(indexPath, JSON.stringify(portFolders, null, 2));

console.log(`Updated index.json with ${portFolders.length} ports:`);
console.log(portFolders.join(', '));
