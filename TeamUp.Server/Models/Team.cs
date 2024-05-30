namespace TeamUp.Server.Models;

public class Team
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public List<Player> Players { get; set; } = new List<Player>();

    public Team() { }
    public Team(List<Player> players)
    {
        Players = players;
    }
}