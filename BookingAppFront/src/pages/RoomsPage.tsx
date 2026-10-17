import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as LinkMUI,
  IconButton
} from '@mui/material';

import type { Equipment, Room, RoomFilters } from '../types';
import RoomFilter from '../components/RoomFilter';
import { Link } from 'react-router';
import { fetchRooms,downloadRoomReport } from '../api/rooms';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchEquipment } from '../api/equipment';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  
  const handleFilter = (filters: RoomFilters) => {
    const filterRoomList = async () => {
      try {
        const roomData = await fetchRooms(filters);
        setRooms(roomData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    filterRoomList();
  };

  useEffect(() => {
    fetchRooms()
      .then((data) => setRooms(data))
      .catch((error) => console.error('Error fetching rooms:', error));;
    fetchEquipment()
      .then((data) => setEquipment(data))
      .catch((error) => console.error('Error fetching equipment:', error));
  }, []);

  return (
      <>
        <Box sx={{mx: 'auto',mb:2}}>
          <Typography variant="h4">
            Rooms
          </Typography>
        </Box>


      <RoomFilter 
        onFilter={handleFilter} 
        initialFilters={{}} 
        equipment={equipment}/>
      
      <TableContainer component={Paper} variant="outlined" >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Room ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Report</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room : Room) => (
                <TableRow
                  key={room.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>{room.id}</TableCell>
                  <TableCell>
                    <LinkMUI 
                      component={Link} 
                      to={`/rooms/${room.id}`}
                      color="inherit"
                      underline="none">
                        {room.name}
                    </LinkMUI></TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.equipment.join(', ')}</TableCell>
                  <TableCell>{room.status}</TableCell>
                <TableCell>
                  <IconButton
                      color="primary"
                      size="small"
                      aria-label="Download room report"
                      onClick={async () => {
                        try {
                          await downloadRoomReport(room.id);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No rooms found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
