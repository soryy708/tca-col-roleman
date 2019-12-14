const fs = require('fs');

function readFile(filePath, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, options, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

function writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function appendFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath, data, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function copyFile(srcPath, destPath) {
    return new Promise((resolve, reject) => {
        fs.copyFile(srcPath, destPath, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function unlink(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function exists(filePath) {
    return new Promise(resolve => {
        fs.exists(filePath, exists => {
            resolve(exists);
        });
    });
}

function mkdir(dirPath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function readdir(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
        });
    });
}

module.exports = {
    readFile,
    writeFile,
    appendFile,
    copyFile,
    rename,
    unlink,
    exists,
    mkdir,
    readdir,
};
