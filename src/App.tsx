import { HashRouter, Routes, Route } from 'react-router-dom'
import { ListPage } from './pages/ListPage'
import { DetailPage } from './pages/DetailPage'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/museum/:id" element={<DetailPage />} />
      </Routes>
    </HashRouter>
  )
}
