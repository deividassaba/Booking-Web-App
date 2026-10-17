using BookingAppBack.Enums;

namespace BookingAppBack.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public int RoomId { get; set; }
        public required Room Room { get; set; }
        public int OrganizerId { get; set; }
        public required User Organizer { get; set; }
        public required int Attendees { get; set; }
        public bool IsCanceled { get; set; }
        public required DateOnly StartDate { get; set; }
        public required DateOnly EndDate { get; set; }

        public ReservationStatus GetStatus()
        {
            return IsCanceled ? ReservationStatus.Cancelled :
                DateOnly.FromDateTime(DateTime.Now) >= EndDate ? ReservationStatus.Completed :
                DateOnly.FromDateTime(DateTime.Now) >= StartDate ? ReservationStatus.Active
                : ReservationStatus.Booked;
        }
    }
}
