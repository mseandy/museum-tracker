import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CityFilter } from '../components/CityFilter'

describe('CityFilter', () => {
  it('renders nothing when cities is empty', () => {
    const { container } = render(<CityFilter cities={[]} value="" onChange={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all cities and default option', () => {
    render(<CityFilter cities={['北京', '上海']} value="" onChange={() => {}} />)
    expect(screen.getByText('全部城市')).toBeDefined()
    expect(screen.getByText('北京')).toBeDefined()
    expect(screen.getByText('上海')).toBeDefined()
  })

  it('calls onChange when selection changes', () => {
    let selected = ''
    render(<CityFilter cities={['北京']} value="" onChange={v => { selected = v }} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '北京' } })
    expect(selected).toBe('北京')
  })
})
