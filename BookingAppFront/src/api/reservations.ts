
import { apiFetch } from './client';
import type {
  Reservation,
  ReservationFilters,
  ReservationRequest,
} from '../types';

const endpoint = 'reservations';

export async function fetchReservations(
  filters?: ReservationFilters,
): Promise<Reservation[]> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.userId !== undefined && filters.userId !== 0) {
      params.set('userId', String(filters.userId));
    }

    if (filters.roomId !== undefined) {
      params.set('roomId', String(filters.roomId));
    }

    if (filters.status !== undefined) {
      params.set('status', filters.status);
    }

    if (filters.fromDate !== undefined) {
      params.set('fromDate', filters.fromDate);
    }

    if (filters.toDate !== undefined) {
      params.set('toDate', filters.toDate);
    }
  }

  const query = params.toString();

  return apiFetch<Reservation[]>(
    `${endpoint}${query ? `?${query}` : ''}`,
  );
}

export function createReservation(
  reservation: ReservationRequest,
): Promise<void> {
  return apiFetch<void>(`${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation),
  });
}

export function cancelReservation(
  id: number,
): Promise<void> {
  return apiFetch<void>(`${endpoint}/${id}/cancel`, {
    method: 'POST',
  });
}

export function endReservation(
  id: number,
): Promise<void> {
  return apiFetch<void>(`${endpoint}/${id}/end`, {
    method: 'POST',
  });
}
