import { useParams, Link } from 'react-router-dom'
import { getMuseumWithVisits } from '../data'
import styles from './DetailPage.module.css'

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const data = id ? getMuseumWithVisits(id) : undefined

  if (!data) {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.back}>← 返回列表</Link>
        <div className={styles.notFound}>
          <p>未找到该博物馆信息</p>
        </div>
      </div>
    )
  }

  const { museum, visits } = data

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.back}>← 返回列表</Link>

      {museum.image && (
        <img className={styles.image} src={museum.image} alt={museum.name} />
      )}

      <h1 className={styles.name}>{museum.name}</h1>
      {museum.nameEn && <p className={styles.nameEn}>{museum.nameEn}</p>}

      {museum.city && (
        <p className={styles.nameEn}>{museum.city}{museum.country ? `，${museum.country}` : ''}</p>
      )}

      <div className={styles.section}>
        <h2>简介</h2>
        <p className={styles.description}>{museum.description || '暂无介绍'}</p>
      </div>

      {visits.length > 0 && (
        <div className={styles.section}>
          <h2>访问记录</h2>
          <ul className={styles.visits}>
            {visits.map(v => (
              <li key={v.id}>{v.date}</li>
            ))}
          </ul>
        </div>
      )}

      {museum.highlights.length > 0 && (
        <div className={styles.section}>
          <h2>镇馆之宝</h2>
          {museum.highlights.map((h, i) => (
            <div key={i} className={styles.highlight}>
              <h3>{h.title}</h3>
              <p>{h.description}</p>
            </div>
          ))}
        </div>
      )}

      {museum.sourceUrl && (
        <p className={styles.source}>
          信息来源：<a href={museum.sourceUrl} target="_blank" rel="noopener noreferrer">{museum.sourceUrl}</a>
        </p>
      )}
    </div>
  )
}
