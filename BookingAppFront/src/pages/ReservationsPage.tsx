import { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  CancelOutlined as CancelIcon,
  StopCircleOutlined as StopIcon,
} from '@mui/icons-material';
import type { Reservation, ReservationFilters, ReservationStatus, Room, User } from '../types';
import ReservationFilter from '../components/ReservationsFilter';
import ReservationForm from '../components/ReservationFormDialog';
import { fetchReservations, cancelReservation, endReservation } from '../api/reservations';
import { fetchRooms } from '../api/rooms';
import { fetchUsers } from '../api/users';


function statusColor(
  status: ReservationStatus,
): 'success' | 'info' | 'error' | 'secondary'{
  switch (status) {
    case 'Active':
      return 'info';
    case 'Booked':
      return 'info'
    case 'Completed':
      return 'success';
    case 'Cancelled':
      return 'error';
  }
}

export default function ReservationsPage() {
  const [filters, setFilters] = useState<ReservationFilters>({});

  const [reservations, setReservations] =useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchReservations()
      .then((data) => setReservations(data))
      .catch((error) => console.error('Error fetching reservations:', error));
    fetchRooms()
      .then((data) => setRooms(data))
      .catch((error) => console.error('Error fetching rooms:', error));
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

    const handleFilter = (filters: ReservationFilters) => {
      fetchReservations(filters)
        .then((data) => setReservations(data))
        .catch((error) => console.error('Error fetching reservations:', error));
    };
  
  async function handleCancelReservation(
    id: number,
  ) {
    await cancelReservation(id)
    fetchReservations(filters)
      .then((data) => setReservations(data))
      .catch((error) => console.error('Error fetching reservations:', error));
  }
  async function handleEndReservation(
    id: number,
  ) {
    await endReservation(id)
    fetchReservations()
      .then((data) => setReservations(data))
      .catch((error) => console.error('Error fetching reservations:', error));    
  }
  return (
    <>
      <Box sx={{mb:2}}>
        <Typography variant="h4" /*fontWeight={700} gutterBottom*/>
          Reservations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage meeting room reservations and meeting status.
        </Typography>
      </Box>

      <ReservationFilter 
        onFilter={handleFilter} 
        filters={filters} 
        setFilters={setFilters} 
        users={users}
        rooms={rooms}/>
        <Box sx={{textAlign:'left',mb:2} } >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Create reservation
        </Button>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 1050 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Room</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Meeting title</TableCell>
              <TableCell>Start date</TableCell>
              <TableCell>End date</TableCell>
              <TableCell>
                Attendees
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reservations.map((reservation) => (
              <TableRow hover key={reservation.id}>
                <TableCell>{reservation.room}</TableCell>
                <TableCell>{reservation.organizer}</TableCell>
                <TableCell>{reservation.title}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {reservation.startDate}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {reservation.endDate}
                </TableCell>
                <TableCell align="center">
                  {reservation.attendees}
                </TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={statusColor(reservation.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>

                  {reservation.status === 'Booked' && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() =>handleCancelReservation(reservation.id)}
                      >
                        Cancel
                      </Button>)}
                    {reservation.status === 'Active' && (
                      <Button
                        size="small"
                        color="success"
                        startIcon={<StopIcon />}
                        onClick={() =>
                          handleEndReservation(reservation.id)
                        }>
                        End early
                      </Button>
                  )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No reservations match your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
        <ReservationForm 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onCreated={() => {handleFilter(filters)}} 
        rooms={rooms} 
        users={users}/>
    </>
  );
}
