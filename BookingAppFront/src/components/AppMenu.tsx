import {
  AppBar,
  Box,
  Button,
  Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function AppMenu() {  

  return (
    <AppBar position="static" color="primary" >          
      <Toolbar sx={{}} >
        <Box sx={{maxWidth:1200, width:'100%',mx:'auto', textAlign:'left'}}>
              <Button color="inherit" component={Link} to="/users">Users</Button>
              <Button color="inherit" component={Link} to="/rooms">Rooms</Button>
              <Button color="inherit" component={Link} to="/reservations">Reservations</Button>
        </Box>
      </Toolbar>

    </AppBar>
  );
}
