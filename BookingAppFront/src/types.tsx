
export interface Equipment {
  id: number;
  name: string;
}
export interface RoomFilters {
  minCapacity?: number;
  floor?: number;
  equipment?: number[];
  isActive?: boolean;
}
export interface ReservationFilters {
  userId?: number;
  roomId?: number;
  status?: ReservationStatus;
  fromDate?: string;
  toDate?: string;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  activeReservations: number;
}
export interface Room {
  id:number;
  name: string;
  capacity: number;
  floor: number;
  equipment: string[];
  status: string;
  reservations? : Reservation[]
}
export interface Reservation {
  id: number;
  room: string;
  organizer: string;
  title: string;
  startDate: string;
  endDate: string;
  attendees: number;
  status: ReservationStatus;
};
export interface ReservationRequest {
  roomId: number;
  organizerId: number;
  title: string;
  startDate: string;
  endDate: string;
  attendees: number;
};
export type ReservationStatus = 'Booked' | 'Completed' | 'Cancelled' | 'Active';
