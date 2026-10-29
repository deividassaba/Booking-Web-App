using BookingAppBack.Models;

namespace BookingAppBack.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any() || context.Rooms.Any() || context.Reservations.Any() || context.Equipment.Any())
            return;
        Equipment[] Equipment = {
            new Equipment { Id = 1, Name = "Projector" },
            new Equipment { Id = 2, Name = "TV Screen" },
            new Equipment { Id = 3, Name = "Video Conferencing System" },
            new Equipment { Id = 4, Name = "Whiteboard" }
        };

        User[] Users =
        {
            new User { Id = 1, FirstName = "John", LastName = "Doe" },
            new User { Id = 2, FirstName = "Jane", LastName = "Smith" },
            new User { Id = 3, FirstName = "Michael", LastName = "Johnson" },
            new User { Id = 4, FirstName = "Emily", LastName = "Brown" },
            new User { Id = 5, FirstName = "David", LastName = "Wilson" }
        };

        Room[] Rooms =
        {
            new Room { Id = 1, Name = "Conference Room A", Capacity = 5, Floor = 1, IsActive = true, Equipment = new List<Equipment> { Equipment[0], Equipment[1] } },
            new Room { Id = 2, Name = "Meeting Room B", Capacity = 10, Floor = 2, IsActive = true, Equipment = new List<Equipment> { Equipment[2] } },
            new Room { Id = 3, Name = "Workshop Room C", Capacity = 20, Floor = 3, IsActive = true, Equipment = new List<Equipment> { Equipment[3] } },
            new Room { Id = 4, Name = "Boardroom D", Capacity = 12, Floor = 1, IsActive = true, Equipment = new List<Equipment> { Equipment[0], Equipment[3], Equipment[1] } },
            new Room { Id = 5, Name = "Training Room E", Capacity = 25, Floor = 2, IsActive = true, Equipment = new List<Equipment> { Equipment[0], Equipment[2] } },
            new Room { Id = 6, Name = "Small Meeting Room F", Capacity = 4, Floor = 3, IsActive = false, Equipment = new List<Equipment> { Equipment[1] } }
        };
        DateOnly DateNow = DateOnly.FromDateTime(DateTime.Now);

        Reservation[] Reservations =
         {
            new Reservation { Id = 1, Title = "Meeting", Organizer = Users[0], Room = Rooms[0], StartDate = DateNow.AddDays(-8), EndDate = DateNow.AddDays(-6), Attendees = 5 },
            new Reservation { Id = 2, Title = "Presentation", Organizer = Users[1], Room = Rooms[1], StartDate = DateNow.AddDays(-5), EndDate = DateNow.AddDays(-3), Attendees = 10 },
            new Reservation { Id = 3, Title = "Sprint Planning", Organizer = Users[2], Room = Rooms[2], StartDate = DateNow.AddDays(-1), EndDate = DateNow.AddDays(2), Attendees = 20 },
            new Reservation { Id = 4, Title = "Budget Review", Organizer = Users[3], Room = Rooms[3], StartDate = DateNow.AddDays(-7), EndDate = DateNow.AddDays(-4), Attendees = 12 },
            new Reservation { Id = 5, Title = "Technical Workshop", Organizer = Users[4], Room = Rooms[4], StartDate = DateNow.AddDays(2), EndDate = DateNow.AddDays(4), Attendees = 25 },
            new Reservation { Id = 7, Title = "Design Review", Organizer = Users[1], Room = Rooms[0], StartDate = DateNow, EndDate = DateNow.AddDays(1), Attendees = 5 },
            new Reservation { Id = 8, Title = "Team Retrospective", Organizer = Users[2], Room = Rooms[3], StartDate = DateNow.AddDays(5), EndDate = DateNow.AddDays(7), Attendees = 12 },
            new Reservation { Id = 9, Title = "Product Demo", Organizer = Users[3], Room = Rooms[4], StartDate = DateNow.AddDays(5), EndDate = DateNow.AddDays(6), Attendees = 25 },
            new Reservation { Id = 10, Title = "Hiring Interview", Organizer = Users[4], Room = Rooms[0], StartDate = DateNow.AddDays(5), EndDate = DateNow.AddDays(7), Attendees = 5 },
            new Reservation { Id = 11, Title = "Architecture Discussion", Organizer = Users[0], Room = Rooms[2], StartDate = DateNow.AddDays(-4), EndDate = DateNow.AddDays(-2), Attendees = 8 },
            new Reservation { Id = 12, Title = "Quarterly Planning", Organizer = Users[1], Room = Rooms[3], StartDate = DateNow.AddDays(2), EndDate = DateNow.AddDays(4), Attendees = 15 },
            new Reservation { Id = 13, Title = "Training Session", Organizer = Users[2], Room = Rooms[4], StartDate = DateNow.AddDays(-8), EndDate = DateNow.AddDays(-6), Attendees = 25 },
            new Reservation { Id = 14, Title = "Marketing Meeting", Organizer = Users[3], Room = Rooms[1], StartDate = DateNow.AddDays(1), EndDate = DateNow.AddDays(3), Attendees = 10 },
            new Reservation { Id = 15, Title = "Sales Presentation", Organizer = Users[4], Room = Rooms[2], StartDate = DateNow.AddDays(-5), EndDate = DateNow.AddDays(-3), Attendees = 15 },
            new Reservation { Id = 16, Title = "New Presentation", Organizer = Users[4], Room = Rooms[2], StartDate = DateNow.AddDays(5), EndDate = DateNow.AddDays(8), Attendees = 15 }
        };
        context.Equipment.AddRange(Equipment);
        context.Users.AddRange(Users);
        context.Rooms.AddRange(Rooms);
        context.Reservations.AddRange(Reservations);
        context.SaveChanges();
    }
}