import { useParams} from 'react-router-dom';
import type { Room } from '../types';
import { useEffect, useState } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import ReservationsCalendar from '../components/ReservationsCalendar';
import { fetchRoom } from '../api/rooms';

export default function RoomPage() {
    const { id } = useParams();
    const [ room, setRoom ] = useState<Room>()

    useEffect(()=>{
       fetchRoom(Number(id))
        .then((data)=>{setRoom(data);console.log(data)})
       
    },[]);

    return(
    <>
  <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
    <Typography
      variant="h4"
      component="h1"
      sx={{ mb: 3 }}
    >
      {room?.name ?? "Room details"}
    </Typography>

    <Paper
        variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Room information
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
          gap: 3,
          mb: 3
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Floor
          </Typography>
          <Typography variant="body1">
            {room?.floor ?? "—"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Typography variant="body1" >
            {room?.status ?? "—"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Equipment
          </Typography>
          <Typography variant="body1">
            {room?.equipment?.length
              ? room.equipment.map(e=>{
                return <Typography sx={{}}>{e}</Typography>;
              })
              : "No equipment listed"}
          </Typography>
        </Box>
      </Box>
      
        {((room && room.reservations && room.reservations.length>0)? 
        <ReservationsCalendar reservations={room.reservations} onReservationClick={(id)=>{console.log("Selected reservation:", id)}}/>
        :"No reservations found")}
    </Paper>
  </Box>
</>
    );
}
