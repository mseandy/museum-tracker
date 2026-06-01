import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MuseumCard } from '../components/MuseumCard'
import type { VisitWithMuseum } from '../types'

const mock: VisitWithMuseum = {
  visitId: 'v-20250101-test',
  date: '2025-01-01',
  museum: {
    id: 'test-museum',
    name: '故宫博物院',
    nameEn: 'The Palace Museum',
    city: '北京',
    country: '中国',
    description: '测试简介',
    image: '',
    highlights: [],
    sourceUrl: '',
  },
}

describe('MuseumCard', () => {
  it('renders museum name and visit date', () => {
    render(
      <MemoryRouter>
        <MuseumCard visitWithMuseum={mock} />
      </MemoryRouter>
    )
    expect(screen.getByText('故宫博物院')).toBeDefined()
    expect(screen.getByText(/2025-01-01/)).toBeDefined()
  })

  it('links to museum detail page', () => {
    render(
      <MemoryRouter>
        <MuseumCard visitWithMuseum={mock} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/museum/test-museum')
  })
})
