import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../components/SearchBar'

describe('SearchBar', () => {
  it('renders input and calls onChange', () => {
    let value = ''
    const onChange = (v: string) => { value = v }
    render(<SearchBar value={value} onChange={onChange} />)

    const input = screen.getByPlaceholderText('搜索博物馆名称...')
    fireEvent.change(input, { target: { value: '故宫' } })
    expect(value).toBe('故宫')
  })

  it('displays the current value', () => {
    render(<SearchBar value="故宫" onChange={() => {}} />)
    const input = screen.getByPlaceholderText('搜索博物馆名称...') as HTMLInputElement
    expect(input.value).toBe('故宫')
  })
})
