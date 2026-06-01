import styles from './CityFilter.module.css'

interface Props {
  cities: string[]
  value: string
  onChange: (city: string) => void
}

export function CityFilter({ cities, value, onChange }: Props) {
  if (cities.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">全部城市</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  )
}
