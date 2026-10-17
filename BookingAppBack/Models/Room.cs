
namespace BookingAppBack.Models
{
    public class Room
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Capacity { get; set; }
        public required int Floor { get; set; }
        public List<Equipment> Equipment { get; set; } = [];
        public List<Reservation> Reservations { get; set; } = [];
        public bool IsActive { get; set; }
    }
}
