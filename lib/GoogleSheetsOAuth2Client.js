'use strict';

const { OAuth2Client } = require('homey-oauth2app');

module.exports = class GoogleSheetsOAuth2Client extends OAuth2Client {

  static API_URL = 'https://www.googleapis.com';
  static TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
  static AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&prompt=consent';
  static SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
  ];

  async getUserinfo() {
    return this.get({
      path: '/oauth2/v2/userinfo',
    });
  }

  async listFiles({
    name,
    mimeType,
  } = {}) {
    let q = [];
    if (mimeType) {
      q.push(`mimeType = '${mimeType}'`);
    }

    if (name) {
      q.push(`name contains '${name}'`);
    }

    if (q.length) {
      q = q.join(' and ');
    }

    return this.get({
      path: '/drive/v3/files',
      query: { q },
    });
  }

  async getSpreadsheet({ spreadsheetId }) {
    return this.get({
      path: `/v4/spreadsheets/${spreadsheetId}/`,
    });
  }

  async appendToSpreadsheet({
    spreadsheetId,
    range,
    values = [],
    insertDataOption = 'INSERT_ROWS',
    valueInputOption = 'USER_ENTERED',
  }) {
    return this.post({
      path: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append`,
      query: {
        insertDataOption,
        valueInputOption,
      },
      json: {
        values,
      },
    });
  }

  async onBuildRequest(...args) {
    const result = await super.onBuildRequest(...args);

    // HACK: Override the API URL for spreadsheets
    if (result.url.includes('/v4/spreadsheets/')) {
      result.url = result.url.replace('www.googleapis.com', 'sheets.googleapis.com');
    }

    return result;
  }

};
