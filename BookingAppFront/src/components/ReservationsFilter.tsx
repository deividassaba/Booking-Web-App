import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
    FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { ReservationFilters, ReservationStatus, Room, User } from "../types";

interface ReservationFilterProps {
  onFilter: (filters: ReservationFilters) => void;
  filters : ReservationFilters
  setFilters : (value: React.SetStateAction<ReservationFilters>) => void;
  rooms : Room[]
  users : User[]
}


export default function ReservationFilter(
    { 
        onFilter, 
        filters, 
        setFilters, 
        rooms,
        users 
    }: ReservationFilterProps) {
    const statusOptions = ["Booked", "Active","Completed", "Cancelled"];
  
  const handleChange = (field: keyof ReservationFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
    const handleSubmit  = () => {
        onFilter(filters);
    }
  const handleReset = () => {
    setFilters({});
    onFilter({});
  };
    return <>
         <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
           <Typography variant="subtitle1">
             Filters
           </Typography>
   
           <Box
             sx={{
               display: 'grid',
               gridTemplateColumns: {
                 xs: '1fr',
                 sm: 'repeat(2, 1fr)',
                 lg: 'repeat(5, 1fr)',
               },
               gap: 2,
               mb: 2
             }}
           >
             <FormControl size="small" fullWidth>
               <InputLabel id="room-filter-label">Room</InputLabel>
               <Select
                 labelId="room-filter-label"
                value={filters.roomId? String(filters.roomId) : ""}
                 label="Room"
                onChange={(event: SelectChangeEvent) => handleChange("roomId", Number(event.target.value))}

               >
                 <MenuItem value="">All rooms</MenuItem>
                 {rooms.map((room) => (
                   <MenuItem key={room.id} value={room.id}>
                     {room.name}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
   
             <FormControl size="small" fullWidth>
               <InputLabel id="organizer-filter-label">
                 Organizer
               </InputLabel>
               <Select
                 labelId="organizer-filter-label"
                 value={filters.userId? String(filters.userId) : ""}
                 label="Organizer"
                onChange={(event: SelectChangeEvent) => handleChange("userId", Number(event.target.value))}
                >
                 <MenuItem value=''>All organizers</MenuItem>
                 {users.map((user) => (
                   <MenuItem key={user.id} value={user.id}>
                     {user.firstName} {user.lastName}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
   
             <FormControl size="small" fullWidth>
               <InputLabel id="status-filter-label">Status</InputLabel>
               <Select
                    labelId="status-filter-label"
                    value={filters.status || ""}
                    label="Status"
                    onChange={(event: SelectChangeEvent) => {
                      const value = event.target.value;
                      handleChange("status", value === "" ? undefined : value as ReservationStatus)}
                    }

               >
                 <MenuItem value='' >All statuses</MenuItem>
                 {statusOptions.map((status) => (
                   <MenuItem key={status} value={status}>
                     {status}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
   
             <TextField
               label="From date"
               type="date"
               size="small"
               fullWidth
               value={filters.fromDate??''}
               onChange={(event) => handleChange("fromDate", event.target.value)}
               slotProps={{ inputLabel: { shrink: true } }}
             />
   
             <TextField
               label="To date"
               type="date"
               size="small"
               fullWidth
                value={filters.toDate??''}
               onChange={(event) => handleChange("toDate", event.target.value)}
               slotProps={{ inputLabel: { shrink: true } }}
             />
           </Box>

           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button type="button" variant="contained"  onClick={ handleSubmit} sx={{ mx: 2 }} size="small"  >
                    Apply filters
                </Button>
                <Button onClick={handleReset} color="inherit" size="small">
                Clear filters
                </Button>
           </Box>
         </Paper>

    </>
}

