using BookingAppBack.Data;
using BookingAppBack.DTOs;
using BookingAppBack.Enums;
using BookingAppBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookingAppBack.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly BookingRulesOptions _bookingRules;
    public ReservationsController(AppDbContext context, 
        IOptions<BookingRulesOptions> bookingRules)
    {
        _context = context;
        _bookingRules = bookingRules.Value;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservationsAsync(
        [FromQuery] int? userId,
        [FromQuery] int? roomId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] string? status)
    {
        var query = _context.Reservations.AsQueryable();

        if (userId.HasValue)
            query = query.Where(r => r.OrganizerId == userId.Value);
        if (roomId.HasValue)
            query = query.Where(r => r.RoomId == roomId.Value);
        if (fromDate.HasValue)
            query = query.Where(r => r.StartDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(r => r.EndDate <= toDate.Value);
        
        var reservations = await query.Select(r => new ReservationDto
        {
            Id = r.Id,
            Room = r.Room.Name,
            Organizer = r.Organizer.FirstName + " " + r.Organizer.LastName,
            Title = r.Title,
            StartDate = r.StartDate.ToString("yyyy-MM-dd"),
            EndDate = r.EndDate.ToString("yyyy-MM-dd"),
            Attendees = r.Attendees,
            Status = r.GetStatus().ToString()
        }).ToListAsync();
        
        if (!string.IsNullOrWhiteSpace(status))
            reservations = reservations.Where(r => r.Status == status).ToList();
        return Ok(reservations);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservationAsync(
    [FromBody] ReservationRequest request)
    {
        var startDate = request.StartDate;
        var endDate = request.EndDate;

        var organizer = _context.Users.FirstOrDefault(u=> u.Id == request.OrganizerId);
        if (organizer == null) return BadRequest("Organizer not found");
        var room = _context.Rooms.FirstOrDefault(u => u.Id == request.RoomId);
        if (room == null) return BadRequest("Room not found");

        var Users = await _context.Users.Include(e => e.Reservations).ToListAsync();
        var Rooms = await _context.Rooms.Include(e => e.Reservations).ToListAsync();
        //R0
        if (startDate>endDate)
        {
            return BadRequest(new
            {
                code = "INVALID_DATE_RANGE",
                message = "Start date cannot be later than end date."
            });
        }
        //R1
        if (!ValidateMaximumDuration(startDate, endDate))
        {
            return BadRequest(new
            {
                code = "MAX_DURATION_EXCEEDED",
                message = $"A reservation cannot exceed {_bookingRules.MaxDurationDays} days."
            });
        }
        //R2
        if (!ValidateRoomOverlap(room,startDate,endDate))
                return BadRequest(new
                {
                    code = "ROOM_OVERLAP",
                    message = $"A room cannot have two active reservations."
                });
        //R3
        if (!ValidateUserOverlap(organizer, startDate, endDate))
        {
            return BadRequest(new
            {
                code = "USER_OVERLAP",
                message = $"The same user cannot organize two meetings that overlap in date"
            });
        }

        //R4
        if (!ValiDateRange(startDate))
        {
            return BadRequest(new
            {
                code = "INVALID_STARTDATE_1",
                message = $"Reservation must start in the future."
            });
        }

        //R5
        if (!ValidateCapacity(room,request.Attendees))
        {
            return BadRequest(new
            {
                code = "MAX_CAPACITY_EXCEEDED",
                message = $"Number of attendees must not exceed the room capacity."
            });
        }

        //R6
        if (!ValidateBookingHorizon(startDate))
        {
            return BadRequest(new
            {
                code = "INVALID_STARTDATE_2",
                message = $"A reservation cannot start more than {_bookingRules.MaxBookingHorizonDays} days in the future."
            });
        }

        //R7
        if (!ValidateActiveRoom(room))
        {
            return BadRequest(new
            {
                code = "ROOM_INACTIVE",
                message = $"Inactive rooms cannot be booked."
            });
        }

        _context.Reservations.Add(new Reservation
        {
            Organizer = organizer,
            Room = room,
            Title = request.Title,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Attendees = request.Attendees
        });
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelReservationAsync(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();
        reservation.IsCanceled = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndReservationAsync(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();
        reservation.EndDate = DateOnly.FromDateTime(DateTime.Now);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    //R1
    private bool ValidateMaximumDuration(DateOnly start, DateOnly end)
    {
        return end.DayNumber - start.DayNumber <= _bookingRules.MaxDurationDays;
    }
    //R2
    private bool ValidateRoomOverlap(Room room, DateOnly start, DateOnly end)
    {
        return !room.Reservations.Any(r =>
            (r.GetStatus() == ReservationStatus.Active || r.GetStatus() == ReservationStatus.Booked) &&
            !(start > r.EndDate || r.StartDate > end)
    );
    }
    //R3
    private bool ValidateUserOverlap(User user, DateOnly start, DateOnly end)
    {
        return !user.Reservations.Any(r=> 
            (r.GetStatus() == ReservationStatus.Active || r.GetStatus() == ReservationStatus.Booked) &&
            !(start > r.EndDate || r.StartDate > end)
            );
    }
    //R4
    private bool ValiDateRange(DateOnly start)
    {
        return start > DateOnly.FromDateTime(DateTime.Now);
    }
    //R5
    private bool ValidateCapacity(Room room, int attendees)
    {
        return room.Capacity >= attendees;
    }
    //R6
    private bool ValidateBookingHorizon(DateOnly start)
    {
        return start > DateOnly.FromDateTime(DateTime.Now);
    }
    //R7
    private bool ValidateActiveRoom(Room room)
    {
        return room.IsActive;
    }
}
