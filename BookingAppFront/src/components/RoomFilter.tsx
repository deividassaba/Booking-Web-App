import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,

} from "@mui/material";
import type { Equipment, RoomFilters } from "../types";


interface RoomFilterProps {
  onFilter: (filters: RoomFilters) => void;
  initialFilters: RoomFilters
  equipment : Equipment[]
}

export default function RoomFilter({ onFilter, initialFilters, equipment}: RoomFilterProps) {
  const [filters, setFilters] = useState<RoomFilters>(initialFilters);


  
  const handleChange = (field: keyof RoomFilters, value: string | number[]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
    console.log(filters);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
               <Typography variant="subtitle1" /*fontWeight={600} sx={{ mb: 2 }}*/>
                 Filters
               </Typography>
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        mb: 2,
      }}
    >

      <TextField
        label="Minimum capacity"
        type="number"
        value={filters.minCapacity??''}
        onChange={(e) => handleChange("minCapacity", e.target.value)}
        slotProps={{ htmlInput: { min: 0 } }}
        size="small"
      />

      <TextField
        label="Floor"
        type="number"
        value={filters.floor??''}
        onChange={(e) => handleChange("floor", e.target.value)}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="equipment-label">Equipment</InputLabel>
      
            <Select
              labelId="equipment-label"
              multiple
              value={filters.equipment??[]}
              onChange={(event)=>{
                handleChange("equipment", event.target.value as number[]);
              }}
              input={<OutlinedInput label="Equipment" />}
              renderValue={(selected) => {
                const text = equipment
                  .filter((item) => selected.includes(item.id))
                  .map((item) => item.name)
                  .join(", ");
                return text.length > 20 ? `${text.slice(0, 17)}...` : text;
              }}
            >
              {equipment.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={(filters.equipment?? []).includes(option.id)} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            
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
  );
}