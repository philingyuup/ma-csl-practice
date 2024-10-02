import { shuffle } from '@/helper/shuffle'
import fsSync from 'fs'
import path from 'path'

const QUESTION_PATH = path.join(process.cwd(), `script/json/questions.json`)

export function getLocalTest(shuffleSize?: number) {
  if (!fsSync.existsSync(QUESTION_PATH)) {
    throw new Error('File does not exist')
  }

  const data = fsSync.readFileSync(QUESTION_PATH, 'utf8')
  const parsed = JSON.parse(data) as string[][]

  return parsed
}
