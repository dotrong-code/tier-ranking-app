import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import ListsPage from './pages/ListsPage.jsx'
import ListEditorPage from './pages/ListEditorPage.jsx'
import SharedListPage from './pages/SharedListPage.jsx'
import NotAvailablePage from './pages/NotAvailablePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lists" element={<ListsPage />} />
      <Route path="/lists/:listId" element={<ListEditorPage />} />
      <Route path="/s/:shareId" element={<SharedListPage />} />
      <Route path="*" element={<NotAvailablePage />} />
    </Routes>
  )
}

export default App