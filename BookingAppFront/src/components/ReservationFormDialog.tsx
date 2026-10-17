
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import type {
  ReservationRequest,
  Room,
  User,
} from '../types';
import { createReservation } from '../api/reservations';

interface ReservationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  rooms: Room[];
  users: User[];
}

const emptyForm: ReservationRequest = {
  roomId: 0,
  organizerId: 0,
  title: '',
  startDate: '',
  endDate: '',
  attendees: 1,
};

export default function ReservationFormDialog({
  open,
  onClose,
  onCreated,
  rooms,
  users,
}: ReservationFormDialogProps) {
  const [form, setForm] =
    useState<ReservationRequest>(emptyForm);

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setFormError('');
      setSuccessMessage('');
    }
  }, [open]);

  async function handleSubmit() {
    setFormError('');
    setSuccessMessage('');

    if (
      !form.roomId ||
      !form.organizerId ||
      !form.title.trim() ||
      !form.startDate ||
      !form.endDate ||
      !form.attendees
    ) {
      setFormError('Please complete all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      await createReservation({
        ...form,
        title: form.title.trim(),
      });
      
      setSuccessMessage('Reservation created successfully.');
      onCreated();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'An error occurred.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create reservation</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {formError && (
            <Alert severity="error">{formError}</Alert>
          )}

          {successMessage && (
            <Alert severity="success">
              {successMessage}
            </Alert>
          )}

          <TextField
            select
            label="Room"
            value={form.roomId}
            onChange={(event) =>
              setForm({
                ...form,
                roomId: Number(event.target.value),
              })
            }
            required
            fullWidth
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Organizer"
            value={form.organizerId==0 ?'':form.organizerId}
            onChange={(event) =>
              setForm({
                ...form,
                organizerId: Number(event.target.value),
              })
            }
            required
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Meeting title"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            required
            fullWidth
          />

          <TextField
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm({ ...form, startDate: event.target.value })
            }
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <TextField
            label="End date"
            type="date"
            value={form.endDate}
            onChange={(event) =>
              setForm({ ...form, endDate: event.target.value })
            }
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <TextField
            label="Number of attendees"
            type="number"
            value={form.attendees}
            onChange={(event) =>
              setForm({
                ...form,
                attendees: Number(event.target.value),
              })
            }
            slotProps={{
              htmlInput: { min: 1, step: 1 },
            }}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
