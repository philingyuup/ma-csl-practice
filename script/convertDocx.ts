import * as mammoth from 'mammoth'
import * as path from 'path'
import * as fs from 'node:fs/promises'

const fileNames = [
  '14-Q-A-test',
  '14-Q-B-test',
  '14-Q-C-test',
  'PQ1',
  'PQ2',
  'PQ3',
  'PQ4',
  'PQ5',
]

const DOCX = 'docx' as const
const HTML = 'html' as const

function createPath(name: string, ext: string) {
  return path.join(__dirname, `./${ext}/${name}.${ext}`)
}

(async () => {
  fileNames.forEach(async (name) => {
    try {
      const docxPath = createPath(name, DOCX)
      const response = await mammoth.convertToHtml({ path: docxPath })
      await fs.writeFile(createPath(name, HTML), response.value)
    } catch (e) {
      console.error('docxPaths: ' + name, e)
    }
  })
})()