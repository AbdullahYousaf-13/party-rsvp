/**
 * Google Apps Script webhook for Party RSVP submissions.
 *
 * Deployment steps:
 * 1. Open your Google Sheet and go to Extensions -> Apps Script.
 * 2. Paste this code into Code.gs.
 * 3. Deploy -> New deployment -> Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into `rsvpWebhookUrl` in src/data/invites.js.
 */

const DEFAULT_SHEET_NAME = 'RSVPs';

function parsePayload(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // Fall through to e.parameter if body is not valid JSON
    }
  }
  return (e && e.parameter) || {};
}

function getTargetSpreadsheet(sheetId) {
  if (sheetId && !/^YOUR_/i.test(String(sheetId).trim())) {
    try {
      return SpreadsheetApp.openById(String(sheetId).trim());
    } catch (err) {
      // Fall back to the bound active spreadsheet if openById fails
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const spreadsheet = getTargetSpreadsheet(payload.sheetId);

    const sheetName = payload.sheetTab || DEFAULT_SHEET_NAME;
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Invite Slug',
        'Guest Name',
        'Attendance',
        'Guest Count',
        'Email / Contact',
        'Dietary & Notes',
        'Song Request',
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    const isAttending =
      payload.attending === true ||
      payload.attending === 'true' ||
      payload.attending === 'yes';

    sheet.appendRow([
      new Date().toISOString(),
      payload.slug || '',
      payload.name || '',
      isAttending ? 'Attending' : 'Unable to Attend',
      isAttending ? Number(payload.guests) || 1 : 0,
      payload.contact || '',
      payload.notes || '',
      payload.songRequest || '',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: 'RSVP recorded' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: error.message || 'Unknown error' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, status: 'Party RSVP webhook is active' })
  ).setMimeType(ContentService.MimeType.JSON);
}
