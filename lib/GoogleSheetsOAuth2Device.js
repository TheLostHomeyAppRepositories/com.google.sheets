'use strict';

const { OAuth2Device } = require('homey-oauth2app');

module.exports = class GoogleSheetsOAuth2Device extends OAuth2Device {

  async getSpreadsheets({ name } = {}) {
    const files = await this.oAuth2Client.listFiles({
      name,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    });
    return files;
  }

  async getSpreadsheet({ spreadsheetId }) {
    return this.oAuth2Client.getSpreadsheet({ spreadsheetId });
  }

  async appendToSpreadsheet({
    spreadsheetId,
    sheetName,
    value,
  }) {
    return this.oAuth2Client.appendToSpreadsheet({
      spreadsheetId,
      range: `'${encodeURIComponent(sheetName)}'`, // TODO: Dynamic A1
      values: [value.split(';')],
    });
  }

};
