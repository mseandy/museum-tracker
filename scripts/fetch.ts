import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pendingPath = path.resolve(__dirname, '../data/pending.json')
const museumsPath = path.resolve(__dirname, '../data/museums.json')
const visitsPath = path.resolve(__dirname, '../data/visits.json')

interface PendingFile {
  pending: Array<{ name: string; date: string }>
}

interface Highlight {
  title: string
  description: string
}

interface Museum {
  id: string
  name: string
  nameEn: string
  city: string
  country: string
  description: string
  image: string
  highlights: Highlight[]
  sourceUrl: string
}

interface MuseumsFile {
  museums: Museum[]
}

interface Visit {
  id: string
  museumId: string
  date: string
  createdAt: string
}

interface VisitsFile {
  visits: Visit[]
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

function writeJson(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface WikipediaPageInfo {
  title?: string
}

interface WikipediaPage {
  pageid?: number
  title?: string
  extract?: string
  thumbnail?: { source: string }
  content_urls?: { desktop: { page: string } }
  missing?: boolean
}

interface WikipediaQueryResult {
  query?: { pages?: Record<string, WikipediaPage> }
  pages?: Record<string, WikipediaPage>
}

async function fetchFromWikipedia(name: string): Promise<Partial<Museum> | null> {
  // Try Chinese Wikipedia first
  const searchUrl = `https://zh.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages|info&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=800&inprop=url&titles=${encodeURIComponent(name)}&origin=*`

  try {
    const res = await fetch(searchUrl)
    const data: WikipediaQueryResult = await res.json()
    const pages = data.query?.pages || data.pages
    if (!pages) return null

    const page = Object.values(pages)[0]
    if (!page || page.missing) return null

    const title = page.title || name

    // Try to get English name from English Wikipedia
    let nameEn = ''
    try {
      const enRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&titles=${encodeURIComponent(title)}&origin=*`
      )
      const enData: WikipediaQueryResult = await enRes.json()
      const enPages = enData.query?.pages || enData.pages
      if (enPages) {
        const enPage = Object.values(enPages)[0] as WikipediaPageInfo
        if (enPage?.title) nameEn = enPage.title
      }
    } catch {
      // English name is optional
    }

    const description = page.extract
      ? page.extract.slice(0, 300).replace(/\n/g, ' ').trim()
      : ''

    return {
      name: title,
      nameEn,
      description,
      image: page.thumbnail?.source || '',
      sourceUrl:
        page.content_urls?.desktop?.page ||
        `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      city: '',
      country: '',
      highlights: [],
    }
  } catch (err) {
    console.error(`  抓取 "${name}" 失败:`, err instanceof Error ? err.message : err)
    return null
  }
}

async function main() {
  const pending = readJson<PendingFile>(pendingPath, { pending: [] })

  if (pending.pending.length === 0) {
    console.log('✅ 没有待处理的博物馆')
    return
  }

  console.log(`🔍 开始抓取 ${pending.pending.length} 个博物馆的信息...\n`)

  const museums = readJson<MuseumsFile>(museumsPath, { museums: [] })
  const visits = readJson<VisitsFile>(visitsPath, { visits: [] })

  for (const item of pending.pending) {
    console.log(`📡 正在抓取: ${item.name}...`)

    // Check if museum already exists
    const existing = museums.museums.find(m => m.name === item.name)

    let museumId: string
    if (existing) {
      console.log(`  ⏭️  博物馆已存在，跳过抓取`)
      museumId = existing.id
    } else {
      const fetched = await fetchFromWikipedia(item.name)
      museumId = slugify(item.name) || item.name

      const museum: Museum = {
        id: museumId,
        name: item.name,
        nameEn: fetched?.nameEn || '',
        city: fetched?.city || '',
        country: fetched?.country || '',
        description: fetched?.description || '暂无信息',
        image: fetched?.image || '',
        highlights: fetched?.highlights || [],
        sourceUrl: fetched?.sourceUrl || '',
      }

      museums.museums.push(museum)
      console.log(`  ✅ 已抓取: ${museum.name}`)
    }

    // Add visit record
    const visitId = `v-${item.date.replace(/-/g, '')}-${museumId}`
    const alreadyVisited = visits.visits.some(
      v => v.museumId === museumId && v.date === item.date
    )

    if (!alreadyVisited) {
      visits.visits.push({
        id: visitId,
        museumId,
        date: item.date,
        createdAt: new Date().toISOString(),
      })
      console.log(`  📅 已添加访问记录: ${item.date}`)
    } else {
      console.log(`  ⏭️  访问记录已存在`)
    }

    console.log('')
  }

  // Sort visits by date descending
  visits.visits.sort((a, b) => b.date.localeCompare(a.date))

  writeJson(museumsPath, museums)
  writeJson(visitsPath, visits)
  writeJson(pendingPath, { pending: [] })

  console.log(`✨ 完成！${museums.museums.length} 个博物馆，${visits.visits.length} 条访问记录`)
}

main()
