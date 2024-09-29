import * as sheet from '@googleapis/sheets'
import * as fs from 'node:fs/promises'
import * as fsSync from 'node:fs'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as qs from 'qs'

dotenv.config()

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const SHEET_ID = process.env.SHEET_ID
const API_KEY = process.env.GOOGLE_API_KEY

function createSheetsURL(spreadsheetId: string, apiKey: string) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
}

const SHEET_RANGE_COLUMNS = 'A1:G30'

function createSingleSheetIdUrl(spreadsheetId: string, apiKey: string, ranges: string[]) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${ranges[0]}?key=${apiKey}`
}

function createSheetIdBatchURL(spreadsheetId: string, apiKey: string, ranges: string[]) {
  const qsRanges = qs.stringify({ ranges }, { indices: false, encode: false })
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${qsRanges}&key=${apiKey}`
}

type Sheets = {
  properties: sheet.sheets_v4.Schema$SpreadsheetProperties,
  sheets: Array<Record<'properties',sheet.sheets_v4.Schema$SheetProperties>>
}

const SHEET_INFO_PATH = path.join(__dirname, `./json/sheetInfo.json`)
const SHEET_DETAILS_PATH = path.join(__dirname, `./json/sheetDetails.json`)

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
    const response = await fetch(createSheetsURL(SPREADSHEET_ID, API_KEY))
    const parsed = await response.json()
    await fs.writeFile(SHEET_INFO_PATH, JSON.stringify(parsed))
    return parsed satisfies Sheets
  } catch (e) {
    console.error('fetch error: ', e)
  }
}

async function readLocalSheetInfo() {
  try {
    if (!fsSync.existsSync(SHEET_INFO_PATH)) {
      throw new Error('file does not exist')
    }

    const data = await fs.readFile(SHEET_INFO_PATH, 'utf8')
    return JSON.parse(data) satisfies Sheets
  } catch (e) {
    console.error('reading local sheet: ', e)
    throw new Error('error or file does not exist')
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

  const sheetTitles = data.sheets
    .map(sheet => sheet.properties.title
      && `${encodeURI(sheet.properties.title)}`)
    .filter(name => typeof name === 'string')
    .map(title => `${title}!${SHEET_RANGE_COLUMNS}`)

  // TODO: refactor this part to be a little cleaner
  if (typeof SPREADSHEET_ID !== 'string'
    || typeof SHEET_ID !== 'string'
    || typeof API_KEY !== 'string'
  ) {
    console.error('SPREADSHEET_ID', SPREADSHEET_ID)
    console.error('SHEET_ID', SHEET_ID)
    console.error('API_KEY', API_KEY)
    throw new Error('Bad process.env')
  }
  
  const sheetRangesURL = createSheetIdBatchURL(SPREADSHEET_ID, API_KEY, sheetTitles)
  console.log('sheetRangesURL', sheetRangesURL)
  try {
    const response = await fetch(sheetRangesURL)
    const parsed = await response.json()
    await fs.writeFile(SHEET_DETAILS_PATH, JSON.stringify(parsed))
    console.log('response', response)
    console.log('parsed', parsed)
  } catch (e) {
    console.error('error fetching sheet ranges: ', e)
  }
})()
