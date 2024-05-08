namespace TeamUp.Server.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Player> Players { get; set; }

}