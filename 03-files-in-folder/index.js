const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, '', 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach(file => {        
        if (file.isFile()) {           
            let ext = path.extname(file.name);
            let name = path.basename(file.name, ext); 
            ext = ext.slice(1);           
            fs.stat(path.join(folder, file.name), (err, stats) => {               
                console.log(`${name} - ${ext} - ${(stats.size / 1024).toFixed(3)}kb`);
            });
        }    
    });
});