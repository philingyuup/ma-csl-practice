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
dotenv.config();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
function createSheetURL(spreadsheetId) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`;
}
const SHEET_INFO_PATH = path.join(__dirname, `./json/sheetInfo.json`);
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
        const response = await fetch(createSheetURL(SPREADSHEET_ID));
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
    console.log('data', data);
})();
