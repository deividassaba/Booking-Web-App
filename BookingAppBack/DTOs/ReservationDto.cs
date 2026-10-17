namespace BookingAppBack.DTOs
{
    public class ReservationDto
    {
        public required int Id { get; set; }
        public required string Room { get; set; }
        public required string Organizer { get; set; }
        public required string Title { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public int Attendees { get; set; }
        public required string Status { get; set; }

    }
}
