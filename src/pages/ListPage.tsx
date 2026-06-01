import { useState, useMemo } from 'react'
import { getVisitsWithMuseums, getUniqueCities } from '../data'
import { SearchBar } from '../components/SearchBar'
import { CityFilter } from '../components/CityFilter'
import { MuseumCard } from '../components/MuseumCard'
import styles from './ListPage.module.css'

export function ListPage() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')

  const visitsWithMuseums = useMemo(() => getVisitsWithMuseums(), [])
  const cities = useMemo(() => getUniqueCities(), [])

  const filtered = useMemo(() => {
    return visitsWithMuseums.filter(v => {
      const matchSearch = !search ||
        v.museum.name.toLowerCase().includes(search.toLowerCase()) ||
        v.museum.nameEn.toLowerCase().includes(search.toLowerCase())
      const matchCity = !city || v.museum.city === city
      return matchSearch && matchCity
    })
  }, [visitsWithMuseums, search, city])

  if (visitsWithMuseums.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>🏛️</p>
          <p>还没有访问记录</p>
          <p>运行 <code>npm run add</code> 添加你的第一个博物馆吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Museum Tracker</h1>
        <p>{visitsWithMuseums.length} 次访问记录</p>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <CityFilter cities={cities} value={city} onChange={setCity} />
      <div className={styles.list}>
        {filtered.map(v => (
          <MuseumCard key={v.visitId} visitWithMuseum={v} />
        ))}
      </div>
    </div>
  )
}
