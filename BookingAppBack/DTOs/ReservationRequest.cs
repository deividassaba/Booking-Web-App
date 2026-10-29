namespace BookingAppBack.DTOs;

public class ReservationRequest
{
    public int RoomId { get; set; }
    public int OrganizerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int Attendees { get; set; }
}
