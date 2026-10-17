import { apiFetch } from './client';
import type {
  Room,
  RoomFilters,
} from '../types';
import config from '../config';

const endpoint = 'rooms';

export async function fetchRooms(filters?: RoomFilters): Promise<Room[]> {
    const params = new URLSearchParams();

    if (filters) {
        if (filters.minCapacity !== undefined) params.set("minCapacity", filters.minCapacity.toString());
        if (filters.floor !== undefined) params.set("floor", filters.floor.toString());
        if (filters.isActive !== undefined ) params.set("isActive", String(filters.isActive));
        filters.equipment?.forEach((id) => {
        params.append("equipment", String(id));
    });
    }
    const query = params.toString();
    return apiFetch<Room[]>(
        `rooms${query ? `?${query}` : ''}`,
    );
}

export async function fetchRoom(
  id: number
): Promise<Room> {
    return apiFetch<Room>(
        `${endpoint}/${id}`,
    );
}

export async function downloadRoomReport( id: number
): Promise<void> {
  const response = await fetch(
    `${config.apiBaseUrl}${endpoint}/${id}/report`
  );

  if (!response.ok) {
    throw new Error(`Failed to generate room report. ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "reservations-report.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();
}