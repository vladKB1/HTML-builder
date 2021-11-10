const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const destination = path.join(__dirname, '', 'destination.txt')
const output = fs.createWriteStream(destination);

console.log('Hello! Please, enter the text:');

stdin.on('data', chunk => {
    let txt = chunk.toString();
    txt = txt.slice(0, txt.length - 2); 
    if (txt === 'exit') {
        process.exit();
    }
    output.write(chunk);
});

process.on('exit', end => console.log('Program has stopped!'));
process.on('SIGINT', end => {    
    process.exit();
});