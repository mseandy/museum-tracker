export interface Highlight {
  title: string
  description: string
}

export interface Museum {
  id: string
  name: string
  nameEn: string
  city: string
  country: string
  description: string
  image: string
  highlights: Highlight[]
  sourceUrl: string
}

export interface Visit {
  id: string
  museumId: string
  date: string
  createdAt: string
}

export interface PendingItem {
  name: string
  date: string
}

export interface PendingData {
  pending: PendingItem[]
}

export interface VisitWithMuseum {
  visitId: string
  date: string
  museum: Museum
}

export interface MuseumWithVisits {
  museum: Museum
  visits: Visit[]
}
