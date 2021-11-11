const path = require('path');
const fs = require('fs');

const srcFolderName = 'styles';
const distFolderName = 'project-dist';
const distFileName = 'bundle.css';
const srcFolder = path.join(__dirname, srcFolderName);
const distFile = path.join(__dirname, distFolderName, distFileName);

const output = fs.createWriteStream(distFile, 'utf-8');

fs.readdir(srcFolder, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        let srcFileName = path.join(srcFolder, file.name);

        if (file.isFile) {
            if (path.extname(srcFileName) === '.css') {
                const input = fs.createReadStream(srcFileName, 'utf-8');                           
                input.on('data', chunk => output.write(chunk));
                input.on('error', error => console.log('Error', error.message));                
            }
        }
    });        
})