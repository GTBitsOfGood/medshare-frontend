const fs = require('fs');

class FileMetadata {
  static get DEFAULT_FILE_MAPPING() {
    return {
      name: 'ProductName',
      productId: 'ProductRef',
      category: 'Category Name',
      subcategory: 'Sub Category'
    };
  }

  static fromMongooseDocumentMetadata(mongooseFileMetadata) {
    return new FileMetadata(
      mongooseFileMetadata.submittedFileName,
      mongooseFileMetadata.encoding,
      mongooseFileMetadata.serverFilePath,
      mongooseFileMetadata.fileMapping
    );
  }

  get fileBuffer() {
    return fs.readFileSync(this.serverFilePath, this.encoding);
  }

  constructor(submittedFileName, encoding, serverFilePath, fileMapping = FileMetadata.DEFAULT_FILE_MAPPING) {
    this.submittedFileName = submittedFileName;
    this.encoding = encoding;
    this.serverFilePath = serverFilePath;
    this.fileMapping = fileMapping;
    this.fileType = submittedFileName.split('.').pop();
  }
}

module.exports = FileMetadata;
