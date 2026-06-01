import { describe, it, expect } from 'vitest'
import { getVisitsWithMuseums, getMuseumWithVisits, getUniqueCities } from '../data'

describe('data layer with empty seed data', () => {
  it('getVisitsWithMuseums returns empty array when no data', () => {
    expect(getVisitsWithMuseums()).toEqual([])
  })

  it('getMuseumWithVisits returns undefined for nonexistent id', () => {
    expect(getMuseumWithVisits('nonexistent')).toBeUndefined()
  })

  it('getUniqueCities returns empty array when no museums', () => {
    expect(getUniqueCities()).toEqual([])
  })
})
