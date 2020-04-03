const fs = require('fs');
const path = require('path');

function deleteAllFilesInDirectory(directoryPath) {
  // done synchronously so it can be called from a "process exit" callback
  const directory = fs.readdirSync(directoryPath);
  directory.forEach(fileName => {
    fs.unlinkSync(path.join(directoryPath, fileName));
  });
}

module.exports = {
  deleteAllFilesInDirectory
};
