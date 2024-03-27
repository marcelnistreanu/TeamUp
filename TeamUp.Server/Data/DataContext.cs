using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Models;

namespace TeamUp.Server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DbSet<Player> Players { get; set; }
}
