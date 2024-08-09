'use strict';

module.exports = class GoogleSheetsUtil {

  // This method parses a Google Sheets Document ID from a URL, or ID.
  // https://docs.google.com/spreadsheets/d/1bNEbWvYuVNTZq9FaiZVhVAHngChxMbCuP1wftw8n3Go/edit#gid=0
  // or
  // 1bNEbWvYuVNTZq9FaiZVhVAHngChxMbCuP1wftw8n3Go
  // both return
  // 1bNEbWvYuVNTZq9FaiZVhVAHngChxMbCuP1wftw8n3Go
  static parseDocumentId(url) {
    const matches = url.match(/[-\w]{25,}/);
    if (!matches) {
      throw new Error('Unknown Document ID');
    }

    return matches[0];
  }

};
