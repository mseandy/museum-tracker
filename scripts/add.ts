import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pendingPath = path.resolve(__dirname, '../data/pending.json')

interface PendingFile {
  pending: Array<{ name: string; date: string }>
}

function readPending(): PendingFile {
  try {
    const raw = fs.readFileSync(pendingPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { pending: [] }
  }
}

function writePending(data: PendingFile): void {
  const dir = path.dirname(pendingPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(pendingPath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, answer => resolve(answer.trim()))
  })
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('🏛️  添加博物馆访问记录\n')

  const name = await question(rl, '博物馆名称: ')
  if (!name) {
    console.log('❌ 名称不能为空')
    rl.close()
    process.exit(1)
  }

  const dateStr = await question(rl, '访问日期 (YYYY-MM-DD): ')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.log('❌ 日期格式不正确，请使用 YYYY-MM-DD 格式')
    rl.close()
    process.exit(1)
  }

  rl.close()

  const pending = readPending()
  pending.pending.push({ name, date: dateStr })
  writePending(pending)

  console.log(`\n✅ 已添加 "${name}" (${dateStr}) 到待处理队列`)
  console.log('运行 npm run fetch 抓取博物馆信息')
}

main()
