'use strict';

const { OAuth2Driver } = require('homey-oauth2app');

module.exports = class GoogleSheetsOAuth2Driver extends OAuth2Driver {

  async onOAuth2Init() {
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
        return this.onAutocompleteDocument({ query, device });
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({ query, device, document });
      });

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
        return this.onAutocompleteDocument({ query, device });
      })
      .registerArgumentAutocompleteListener('sheet', async (query, { device, document }) => {
        return this.onAutocompleteSheet({ query, device, document });
      });
  }

  async onAutocompleteDocument({ query, device }) {
    const { files } = await device.getSpreadsheets({
      name: query,
    });
    return files.map((file) => ({
      name: file.name,
      id: file.id,
      image: 'https://etc.athom.com/app/com.google.sheets/document.png',
    }));
  }

  async onAutocompleteSheet({ query, device, document }) {
    if (!document || document === 'undefined') {
      throw new Error('Please select the document first.');
    }

    const { sheets } = await device.getSpreadsheet({
      spreadsheetId: document.id,
    });

    return sheets.map((sheet) => ({
      name: sheet.properties.title,
    }));
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
