const fs = require('fs');
const path = require('path');

filePath = path.join(__dirname, '', 'text.txt');
console.log(filePath);

const readableStream = fs.createReadStream(filePath, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));