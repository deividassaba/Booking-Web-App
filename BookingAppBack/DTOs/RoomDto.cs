namespace BookingAppBack.DTOs;

public class RoomDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required int Capacity { get; set; }
    public required int Floor { get; set; }
    public required IEnumerable<string> Equipment { get; set; }
    public required string Status { get; set; }
}
