import { Link } from 'react-router-dom'
import type { VisitWithMuseum } from '../types'
import styles from './MuseumCard.module.css'

interface Props {
  visitWithMuseum: VisitWithMuseum
}

export function MuseumCard({ visitWithMuseum }: Props) {
  const { date, museum } = visitWithMuseum
  return (
    <Link to={`/museum/${museum.id}`} className={styles.card}>
      {museum.image ? (
        <img className={styles.thumb} src={museum.image} alt={museum.name} />
      ) : (
        <div className={styles.thumb} />
      )}
      <div className={styles.info}>
        <h2 className={styles.name}>{museum.name}</h2>
        <p className={styles.meta}>
          {museum.city && `${museum.city} · `}访问于 {date}
        </p>
      </div>
    </Link>
  )
}
