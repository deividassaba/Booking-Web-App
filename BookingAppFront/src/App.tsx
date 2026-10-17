import { Routes, Route } from 'react-router-dom';
import './App.css'
import UsersPage from './pages/UsersPage.tsx';
import AppMenu from './components/AppMenu.tsx';
import ReservationsPage from './pages/ReservationsPage.tsx';
import RoomsPage from './pages/RoomsPage.tsx';
import { Box } from '@mui/material';
import RoomPage from './pages/RoomPage.tsx';
function App() {
  return <>
      <AppMenu/>
      <Box sx={{mx:'auto', maxWidth: 1300 , width:'100%', p: { xs: 2, md: 4 }}}>
        <Routes>
          <Route path="/" element={<ReservationsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomPage />} />
        </Routes>
      </Box>
    </>
     
}

export default App
