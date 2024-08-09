'use strict';

const { OAuth2Driver } = require('homey-oauth2app');
const GoogleSheetsUtil = require('./GoogleSheetsUtil');

module.exports = class GoogleSheetsOAuth2Driver extends OAuth2Driver {

  async onOAuth2Init() {
    // Note: this Flow Card is deprecated
    this.homey.flow.getActionCard('appendRowToGoogleSheet')
      .registerRunListener(async ({
        device,
        document,
        sheet,
        value,
      }) => {
        await device.appendToSpreadsheet({
          value,
          spreadsheetId: document.id,
          sheetName: sheet.name,
        });
      })
      .registerArgumentAutocompleteListener('document', async (query, { device }) => {
        throw new Error('This Flow Card has been deprecated. Please replace it with the new Flow Card to append a row to a Google Sheet.');
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({
          query,
          device,
          spreadsheetId: document.id,
        });
      });

    this.homey.flow.getActionCard('appendRowToGoogleSheet_v2')
      .registerRunListener(async ({
        device,
        document,
        sheet,
        value,
      }) => {
        await device.appendToSpreadsheet({
          value,
          spreadsheetId: GoogleSheetsUtil.parseDocumentId(document),
          sheetName: sheet.name,
        });
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({
          query,
          device,
          spreadsheetId: GoogleSheetsUtil.parseDocumentId(document),
        });
      });

    // Note: this Flow Card is deprecated
    this.homey.flow.getActionCard('appendRowToGoogleSheetWithTimestamp')
      .registerRunListener(async ({
        device,
        document,
        sheet,
        value,
      }) => {
        const timeZone = await this.homey.clock.getTimezone();
        const now = new Date();
        const date = now.toLocaleString('US', { dateStyle: 'medium', timeZone });
        const time = now.toLocaleString('US', { timeStyle: 'medium', timeZone, hour12: true });

        await device.appendToSpreadsheet({
          value: `${date} ${time};${value}`,
          spreadsheetId: document.id,
          sheetName: sheet.name,
        });
      })
      .registerArgumentAutocompleteListener('document', async (query, { device }) => {
        throw new Error('This Flow Card has been deprecated. Please replace it with the new Flow Card to append a row to a Google Sheet.');
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({
          query,
          device,
          spreadsheetId: document.id,
        });
      });

    this.homey.flow.getActionCard('appendRowToGoogleSheetWithTimestamp_v2')
      .registerRunListener(async ({
        device,
        document,
        sheet,
        value,
      }) => {
        const timeZone = await this.homey.clock.getTimezone();
        const now = new Date();
        const date = now.toLocaleString('US', { dateStyle: 'medium', timeZone });
        const time = now.toLocaleString('US', { timeStyle: 'medium', timeZone, hour12: true });

        await device.appendToSpreadsheet({
          value: `${date} ${time};${value}`,
          spreadsheetId: GoogleSheetsUtil.parseDocumentId(document),
          sheetName: sheet.name,
        });
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({
          query,
          device,
          spreadsheetId: GoogleSheetsUtil.parseDocumentId(document),
        });
      });
  }

  async onAutocompleteSheet({ query, device, spreadsheetId }) {
    if (!spreadsheetId) {
      throw new Error('Please select the document first.');
    }

    const { sheets } = await device.getSpreadsheet({ spreadsheetId });
    return sheets
      .map((sheet) => ({
        name: sheet.properties.title,
      }))
      .filter((sheet) => {
        return sheet.name.toLowerCase().includes(query.toLowerCase());
      });
  }

  async onPairListDevices({ oAuth2Client }) {
    const {
      id,
      email,
    } = await oAuth2Client.getUserinfo();

    return [{
      name: email,
      data: { id },
      store: { email },
    }];
  }

};
