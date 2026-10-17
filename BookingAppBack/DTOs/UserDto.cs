using BookingAppBack.Models;

namespace BookingAppBack.DTOs
{
    public class UserDto
    {
        public required int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required int ActiveReservations { get; set; }
    }
}
