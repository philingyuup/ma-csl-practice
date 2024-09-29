import * as sheet from '@googleapis/sheets'
import * as fs from 'node:fs/promises'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const SHEET_ID = process.env.SHEET_ID
const API_KEY = process.env.GOOGLE_API_KEY

function createSheetURL(spreadsheetId: string) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`
}

type Sheets = {
  properties: sheet.sheets_v4.Schema$SpreadsheetProperties,
  sheets: Array<Record<'properties',sheet.sheets_v4.Schema$SheetProperties>>
}

const SHEET_INFO_PATH = path.join(__dirname, `./json/sheetInfo.json`)

async function retrieveSheetInfo() {
  try {
    if (typeof SPREADSHEET_ID !== 'string'
      || typeof SHEET_ID !== 'string'
      || typeof API_KEY !== 'string'
    ) {
      console.error('SPREADSHEET_ID', SPREADSHEET_ID)
      console.error('SHEET_ID', SHEET_ID)
      console.error('API_KEY', API_KEY)
      throw new Error('Bad process.env')
    }
    const response = await fetch(createSheetURL(SPREADSHEET_ID))
    const parsed = await response.json()
    await fs.writeFile(SHEET_INFO_PATH, JSON.stringify(parsed))
    return parsed satisfies Sheets
  } catch (e) {
    console.error('fetch error: ', e)
  }
}

async function readLocalSheetInfo() {
  try {
    const data = await fs.readFile(SHEET_INFO_PATH, 'utf8')
    return JSON.parse(data) satisfies Sheets
  } catch (e) {
    console.error('reading local sheet: ', e)
  }
}

// take sheet and create CSV
(async () => {
  let data: Sheets
  try {
    data = await readLocalSheetInfo()
  } catch (e) {
    console.error('read error: ', e)
    data = await retrieveSheetInfo()
  }

  console.log('data', data)
})()
