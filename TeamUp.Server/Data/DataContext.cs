using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Models;

namespace TeamUp.Server.Data;

public class DataContext : DbContext
{
    public DataContext() { }
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DbSet<Player> Players { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<PlayerRatingHistory> PlayerRatingHistory { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Player>()
            .HasMany(p => p.Teams)
            .WithMany(t => t.Players);

        modelBuilder.Entity<Game>()
            .HasOne(g => g.Team1)
            .WithMany();

        modelBuilder.Entity<Game>()
            .HasOne(g => g.Team2)
            .WithMany();

        modelBuilder.Entity<Game>()
            .HasMany(g => g.Players)
            .WithMany(p => p.Games);

        modelBuilder.Entity<PlayerRatingHistory>()
            .HasOne(h => h.Player)
            .WithMany();

        modelBuilder.Entity<PlayerRatingHistory>()
            .HasOne(h => h.Game)
            .WithMany();
    }
}
