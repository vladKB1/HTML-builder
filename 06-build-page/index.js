const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');


async function bundleCSS(srcFolder, distFile) {
    const output = await fs.createWriteStream(distFile, 'utf-8');

    await fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
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
    });
}

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
                    fs.rm(srcPath, { recursive: true }, err => { });
                } else {
                    if (!file.isFile) deleteMissingFiles(srcPath, distPath);
                }
            });
        });
    });
}

async function bundleHTML(srcHTML, distHTML) {
    try {
        let str = await fsPromises.readFile(srcHTML, 'utf-8');

        while (str.indexOf('{{') != -1) {
            const componentName = str.slice(str.indexOf('{{') + 2, str.indexOf('}}'));
            const componentPath = path.join(componentsFolder, componentName + '.html');                                  
            const component = await fsPromises.readFile(componentPath, 'utf-8');            
            str = str.replace(`{{${componentName}}}`, component);
        }

        const output = fs.createWriteStream(distHTML, 'utf-8');
        output.write(str);
    }
    catch (error) {
        console.log(error.message);
    }
}
    

const executeFolderName = 'project-dist';
const executeFolder = path.join(__dirname, executeFolderName);

const srcStyleFolderName = 'styles';
const srcStyleFolder = path.join(__dirname, srcStyleFolderName);
const distStyleFileName = 'style.css';
const distStyleFile = path.join(__dirname, executeFolderName, distStyleFileName);

const srcFilesFolderName = 'assets';
const srcFilesFolder = path.join(__dirname, srcFilesFolderName);
const distFilesFolderName = 'assets';
const distFilesFolder = path.join(__dirname, executeFolderName, distFilesFolderName);

const srcHTMLName = 'template.html';
const srcHTML = path.join(__dirname, srcHTMLName);
const distHTMLName = 'index.html';
const distHTML = path.join(__dirname, executeFolderName, distHTMLName);
const componentsFolderName = 'components';
const componentsFolder = path.join(__dirname, componentsFolderName);


createDir(executeFolder);
bundleCSS(srcStyleFolder, distStyleFile);

createDir(distFilesFolder);
recursiveCopying(srcFilesFolder, distFilesFolder);
deleteMissingFiles(srcFilesFolder, distFilesFolder);

bundleHTML(srcHTML, distHTML);