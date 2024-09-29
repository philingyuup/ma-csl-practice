"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs/promises"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const qs = __importStar(require("qs"));
dotenv.config();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
function createSheetsURL(spreadsheetId, apiKey) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`;
}
const SHEET_RANGE_COLUMNS = 'A1:G30';
function createSingleSheetIdUrl(spreadsheetId, apiKey, ranges) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${ranges[0]}?key=${apiKey}`;
}
function createSheetIdBatchURL(spreadsheetId, apiKey, ranges) {
    const qsRanges = qs.stringify({ ranges }, { indices: false, encode: false });
    return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${qsRanges}&key=${apiKey}`;
}
const SHEET_INFO_PATH = path.join(__dirname, `./json/sheetInfo.json`);
const SHEET_DETAILS_PATH = path.join(__dirname, `./json/sheetDetails.json`);
async function retrieveSheetInfo() {
    try {
        if (typeof SPREADSHEET_ID !== 'string'
            || typeof SHEET_ID !== 'string'
            || typeof API_KEY !== 'string') {
            console.error('SPREADSHEET_ID', SPREADSHEET_ID);
            console.error('SHEET_ID', SHEET_ID);
            console.error('API_KEY', API_KEY);
            throw new Error('Bad process.env');
        }
        const response = await fetch(createSheetsURL(SPREADSHEET_ID, API_KEY));
        const parsed = await response.json();
        await fs.writeFile(SHEET_INFO_PATH, JSON.stringify(parsed));
        return parsed;
    }
    catch (e) {
        console.error('fetch error: ', e);
    }
}
async function readLocalSheetInfo() {
    try {
        const data = await fs.readFile(SHEET_INFO_PATH, 'utf8');
        return JSON.parse(data);
    }
    catch (e) {
        console.error('reading local sheet: ', e);
    }
}
// take sheet and create CSV
(async () => {
    let data;
    try {
        data = await readLocalSheetInfo();
    }
    catch (e) {
        console.error('read error: ', e);
        data = await retrieveSheetInfo();
    }
    const sheetTitles = data.sheets
        .map(sheet => sheet.properties.title
        && `${encodeURI(sheet.properties.title)}`)
        .filter(name => typeof name === 'string')
        .map(title => `${title}!${SHEET_RANGE_COLUMNS}`);
    // TODO: refactor this part to be a little cleaner
    if (typeof SPREADSHEET_ID !== 'string'
        || typeof SHEET_ID !== 'string'
        || typeof API_KEY !== 'string') {
        console.error('SPREADSHEET_ID', SPREADSHEET_ID);
        console.error('SHEET_ID', SHEET_ID);
        console.error('API_KEY', API_KEY);
        throw new Error('Bad process.env');
    }
    const sheetRangesURL = createSheetIdBatchURL(SPREADSHEET_ID, API_KEY, sheetTitles);
    console.log('sheetRangesURL', sheetRangesURL);
    try {
        const response = await fetch(sheetRangesURL);
        const parsed = await response.json();
        await fs.writeFile(SHEET_INFO_PATH, JSON.stringify(parsed));
        console.log('response', response);
        console.log('parsed', parsed);
    }
    catch (e) {
        console.error('error fetching sheet ranges: ', e);
    }
})();
