using Microsoft.EntityFrameworkCore;
using BookingAppBack.Models;

namespace BookingAppBack.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options)
        : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<Equipment> Equipment => Set<Equipment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Room)
                .WithMany(room => room.Reservations)
                .HasForeignKey(r => r.RoomId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Organizer)
                .WithMany(user => user.Reservations)
                .HasForeignKey(r => r.OrganizerId);
            modelBuilder.Entity<Room>()
                .HasMany(r => r.Equipment)
                .WithMany();
        }

    }
}
