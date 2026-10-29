
using BookingAppBack.Controllers;
using BookingAppBack.Data;
using BookingAppBack.DTOs;
using BookingAppBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

public class ReservationsControllerTests
{
    private readonly AppDbContext _context;
    private readonly ReservationsController _controller;

    public ReservationsControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        _context.Users.Add(new User
        {
            Id = 1,
            FirstName = "Test",
            LastName = "Organizer"
        });

        _context.Rooms.Add(new Room
        {
            Id = 1,
            Name = "Room A",
            Floor = 1,
            Capacity = 10,
            IsActive = true
        });

        _context.SaveChanges();

        var rules = Options.Create(new BookingRulesOptions
        {
            MaxDurationDays = 7,
            MaxBookingHorizonDays = 90
        });

        _controller = new ReservationsController(_context, rules);
    }

    private static ReservationRequest ValidRequest()
    {
        var start = DateOnly.FromDateTime(DateTime.Now).AddDays(1);

        return new ReservationRequest
        {
            RoomId = 1,
            OrganizerId = 1,
            Title = "Test meeting",
            StartDate = start,
            EndDate = start.AddDays(1),
            Attendees = 5
        };
    }

    [Fact]
    public async Task CreateReservationAsync_UnknownOrganizer_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.OrganizerId = 999;

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CreateReservationAsync_UnknownRoom_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.RoomId = 999;

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CreateReservationAsync_DurationOverSevenDays_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.EndDate = request.StartDate.AddDays(8);

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CreateReservationAsync_StartInPast_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.StartDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-2);
        request.EndDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-1);

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }
    [Fact]
    public async Task CreateReservationAsync_EndBeforeStart_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.StartDate = DateOnly.FromDateTime(DateTime.Now).AddDays(3);
        request.EndDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1);

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }
    [Fact]
    public async Task CreateReservationAsync_StartToday_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.StartDate = DateOnly.FromDateTime(DateTime.Now);
        request.EndDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1);

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }
    [Fact]
    public async Task CreateReservationAsync_StartAndEndSameDay_ReturnsSuccess()
    {
        var request = ValidRequest();
        request.StartDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1);
        request.EndDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1);

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<NoContentResult>(result);
    }
    [Fact]
    public async Task CreateReservationAsync_AttendeesExceedCapacity_ReturnsBadRequest()
    {
        var request = ValidRequest();
        request.Attendees = 11;

        var result = await _controller.CreateReservationAsync(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CreateReservationAsync_InactiveRoom_ReturnsBadRequest()
    {
        var room = await _context.Rooms.FindAsync(1);
        room!.IsActive = false;
        await _context.SaveChangesAsync();

        var result = await _controller.CreateReservationAsync(ValidRequest());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CreateReservationAsync_ValidRequest_ReturnsSuccess()
    {

        var result = await _controller.CreateReservationAsync(ValidRequest());
        Assert.IsType<NoContentResult>(result);
    }
}
