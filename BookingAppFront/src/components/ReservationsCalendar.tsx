
import { useMemo } from "react";
import FullCalendar, { type EventClickInfo, type EventSourceInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME

import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/blue.css'; // YOUR THEME'S PALETTE

interface Reservation {
  id: number;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
}

interface ReservationCalendarProps {
  reservations: Reservation[];
  onReservationClick?: (id: number) => void;
}

export default function ReservationCalendar({
  reservations,
  onReservationClick,
}: ReservationCalendarProps) {
const events = useMemo<EventSourceInput>(
    () =>
      reservations.map((reservation) => ({
        id: String(reservation.id),
        title: `${reservation.title} — ${reservation.organizer}`,
        start: reservation.startDate,
        end: addOneDay(reservation.endDate),
        allDay: true,
      })),
    [reservations]
  );

  function handleEventClick(info: EventClickInfo) {
    onReservationClick?.(Number(info.event.id));
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin,themePlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev",
        center: "title",
        right: "next"
      }}
      events={events}
      eventClick={handleEventClick}
      height="auto"
      dayMaxEvents={3}
    />
  );
}

function addOneDay(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
