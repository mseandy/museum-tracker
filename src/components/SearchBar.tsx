import styles from './SearchBar.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="text"
        placeholder="搜索博物馆名称..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
