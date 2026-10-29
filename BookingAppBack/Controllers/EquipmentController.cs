using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingAppBack.Models;
using BookingAppBack.Data;

namespace BookingAppBack.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _context;
    public EquipmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
    {
        return await _context.Equipment.ToListAsync();
    }
}
