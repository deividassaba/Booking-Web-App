using BookingAppBack.Data;
using BookingAppBack.DTOs;
using BookingAppBack.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly AppDbContext _context;
    public RoomsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms(
    [FromQuery] string? name,
    [FromQuery] int? minCapacity,
    [FromQuery] int? floor,
    [FromQuery] List<int>? equipment,
    [FromQuery] bool? isActive)
    {
        var query = _context.Rooms.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(r => r.Name.Contains(name));
        if (minCapacity.HasValue)
            query = query.Where(r => r.Capacity >= minCapacity.Value);
        if (floor.HasValue)
            query = query.Where(r => r.Floor == floor.Value);
        if (isActive.HasValue)
            query = query.Where(r => r.IsActive == isActive.Value);
        if (equipment?.Any() == true)
        {
            //query = query.Where(r => equipment.All(equipmentId => r.Equipment.Any(e => e.Id == equipmentId))); cant be translated 
            foreach (var equipmentId in equipment)
                query = query.Where(r => r.Equipment.Any(e => e.Id == equipmentId));
        }
        var rooms = await query
            .Select(r => new RoomDto
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
                Floor = r.Floor,
                Equipment = r.Equipment.Select(e => e.Name),
                Status = r.IsActive ? "Active" : "Inactive"
            })
            .ToListAsync();

        return Ok(rooms);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<RoomExtendedDto>> GetRoom(int id)
    {
        var room = await _context.Rooms
            .Include(r => r.Reservations)
                .ThenInclude(r => r.Organizer)
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound();
        }
        return new RoomExtendedDto
        {
            Id = room.Id,
            Name = room.Name,
            Capacity = room.Capacity,
            Floor = room.Floor,
            Equipment = room.Equipment.Select(e => e.Name),
            Status = room.IsActive ? "Active" : "Inactive",
            Reservations = room.Reservations
            .Where(r=>r.GetStatus()!=ReservationStatus.Cancelled)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                Room = r.Room.Name,
                Organizer = r.Organizer.FirstName + " " + r.Organizer.LastName,
                Title = r.Title,
                StartDate = r.StartDate.ToString("yyyy-MM-dd"),
                EndDate = r.EndDate.ToString("yyyy-MM-dd"),
                Attendees = r.Attendees,
                Status = r.GetStatus().ToString()
            })
        };
    }
    [HttpGet("{id}/report")]
    public async Task<IActionResult> GetRoomReport(int id)
    {
        var room = await _context.Rooms
            .Include(r => r.Reservations)
                .ThenInclude(r => r.Organizer)
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound();
        }

        var document = new RoomReport(room);
        var pdf = document.GeneratePdf();

        return File(
            pdf,
            "application/pdf",
            $"room-id{room.Id}-report-{DateTime.Now:yyyy-MM-dd}.pdf"
        );
    }

}
