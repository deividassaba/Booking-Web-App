using BookingAppBack.Data;
using BookingAppBack.DTOs;
using BookingAppBack.Enums;
using BookingAppBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingAppBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Reservations)
                .ToListAsync();

            return users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                ActiveReservations = u.Reservations.Count(r =>
                    r.GetStatus() == ReservationStatus.Booked ||
                    r.GetStatus() == ReservationStatus.Active)
            }).ToList();
        }
    }
}
