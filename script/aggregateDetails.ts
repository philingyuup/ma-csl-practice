import * as fsSync from 'node:fs'
import * as fs from 'node:fs/promises'
import * as path from 'path'
import * as sheet from '@googleapis/sheets'

const SHEET_DETAILS_PATH = path.join(__dirname, `./json/sheetDetails.json`);
const QUESTIONS_PATH = path.join(__dirname, `./json/questions.json`);

type SheetDetails = sheet.sheets_v4.Schema$BatchGetValuesResponse

(async () => {
  try {
    if (!fsSync.existsSync(SHEET_DETAILS_PATH)) {
      throw new Error('read file does not exist')
    }

    const data = await fs.readFile(SHEET_DETAILS_PATH, 'utf8')
    const parsed = JSON.parse(data) as SheetDetails

    if (!Array.isArray(parsed.valueRanges)) throw new Error('value ranges does not exist')

    const questions: string[][] = []
    parsed.valueRanges.forEach((range) => {
      if (!Array.isArray(range.values) || range.values.length < 2) return

      // Remove the 'column name' row
      const [_first, ...rest] = range.values
      questions.push(...rest)
      return
    })

    await fs.writeFile(QUESTIONS_PATH, JSON.stringify(questions))
  } catch (e) {
    console.error('Error in aggregate details: ', e)
  }
})()