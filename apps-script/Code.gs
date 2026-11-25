/**
 * Google Apps Script webhook for Party RSVP submissions.
 *
 * Features:
 * - Upserts by guest name: if a row with the same Guest Name already exists,
 *   it updates that row instead of appending a duplicate.
 * - Creates the sheet tab and header row automatically on first submission.
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
const HEADER_ROW = [
  'Timestamp',
  'Invite Slug',
  'Guest Name',
  'Attendance',
  'Guest Count',
  'Email / Contact',
  'Dietary & Notes',
  'Song Request',
];
const NAME_COLUMN_INDEX = 3; // 1-based: column C = "Guest Name"

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

function ensureSheetWithHeaders(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight('bold');
  }
  return sheet;
}

function findExistingRowByName(sheet, guestName) {
  if (!guestName || sheet.getLastRow() <= 1) return -1;

  var dataRange = sheet.getRange(2, NAME_COLUMN_INDEX, sheet.getLastRow() - 1, 1);
  var values = dataRange.getValues();
  var normalizedName = String(guestName).trim().toLowerCase();

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === normalizedName) {
      return i + 2; // Convert 0-based array index to 1-based sheet row (skip header)
    }
  }
  return -1;
}

function buildRowData(payload) {
  var isAttending =
    payload.attending === true ||
    payload.attending === 'true' ||
    payload.attending === 'yes';

  return [
    new Date().toISOString(),
    payload.slug || '',
    payload.name || '',
    isAttending ? 'Attending' : 'Unable to Attend',
    isAttending ? Number(payload.guests) || 1 : 0,
    payload.contact || '',
    payload.notes || '',
    payload.songRequest || '',
  ];
}

function doPost(e) {
  try {
    var payload = parsePayload(e);
    var spreadsheet = getTargetSpreadsheet(payload.sheetId);
    var sheetName = payload.sheetTab || DEFAULT_SHEET_NAME;
    var sheet = ensureSheetWithHeaders(spreadsheet, sheetName);
    var rowData = buildRowData(payload);

    var existingRow = findExistingRowByName(sheet, payload.name);
    var action;

    if (existingRow > 0) {
      // Update existing row in place
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
      action = 'updated';
    } else {
      // Append new row
      sheet.appendRow(rowData);
      action = 'created';
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: 'RSVP ' + action, action: action })
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
