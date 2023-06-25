'use strict';

const { OAuth2App } = require('homey-oauth2app');
const GoogleSheetsOAuth2Client = require('./GoogleSheetsOAuth2Client');

module.exports = class GoogleSheetsOAuth2App extends OAuth2App {

  static OAUTH2_CLIENT = GoogleSheetsOAuth2Client;
  static OAUTH2_DEBUG = true;

};
