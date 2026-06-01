import museumsRaw from '../data/museums.json'
import visitsRaw from '../data/visits.json'
import type { Museum, Visit, VisitWithMuseum, MuseumWithVisits } from './types'

const museumsData = museumsRaw as { museums: Museum[] }
const visitsData = visitsRaw as { visits: Visit[] }

export function getAllMuseums(): Museum[] {
  return museumsData.museums
}

export function getAllVisits(): Visit[] {
  return visitsData.visits
}

export function getMuseumById(id: string): Museum | undefined {
  return museumsData.museums.find(m => m.id === id)
}

export function getVisitsByMuseumId(museumId: string): Visit[] {
  return visitsData.visits
    .filter(v => v.museumId === museumId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getVisitsWithMuseums(): VisitWithMuseum[] {
  const museumMap = new Map(museumsData.museums.map(m => [m.id, m]))
  return [...visitsData.visits]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(visit => {
      const museum = museumMap.get(visit.museumId)
      if (!museum) return null
      return { visitId: visit.id, date: visit.date, museum }
    })
    .filter((v): v is VisitWithMuseum => v !== null)
}

export function getMuseumWithVisits(id: string): MuseumWithVisits | undefined {
  const museum = getMuseumById(id)
  if (!museum) return undefined
  return {
    museum,
    visits: getVisitsByMuseumId(id),
  }
}

export function getUniqueCities(): string[] {
  const cities = new Set(museumsData.museums.map(m => m.city).filter(Boolean))
  return [...cities].sort()
}
