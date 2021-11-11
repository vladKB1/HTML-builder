const path = require('path');
const fs = require('fs');

async function createDir(folder) {
    await fs.mkdir(folder, { recursive: true }, (err) => {               
        if (err) throw err;
    });    
}

async function recursiveCopying(srcFolder, distFolder) {    
    await fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach(file => {      
            let oldPath = path.join(srcFolder, file.name);
            let newPath = path.join(distFolder, file.name);
            
            if (file.isFile()) {                               
                fs.copyFile(oldPath, newPath, (err) => {
                    if (err) throw err;                    
                });            
            } else {            
                createDir(newPath);
                recursiveCopying(oldPath, newPath);
            }  
        });
    });
}

async function deleteMissingFiles(srcFolder, distFolder) {
    await fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach(file => {  
            let srcPath = path.join(srcFolder, file.name);
            let distPath = path.join(distFolder, file.name);

            fs.access(distPath, err => {
                if (err) {                                                                                                
                    fs.rm(srcPath, { recursive: true }, err => {});                                           
                } else {
                    if (!file.isFile) deleteMissingFiles(srcPath, distPath);                    
                }
            });  
        });
    });
}

const distFolderName = 'files-copy';
const srcFolderName = 'files';
const distFolder = path.join(__dirname, distFolderName);
const srcFolder = path.join(__dirname, srcFolderName);


createDir(distFolder);
recursiveCopying(srcFolder, distFolder)
deleteMissingFiles(distFolder, srcFolder);

