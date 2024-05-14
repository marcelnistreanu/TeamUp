using System.ComponentModel.DataAnnotations.Schema;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Models;

public class Game
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    //public TimeSpan Time { get; set; }
    public string Location { get; set; }
    public int ScoreTeam1 { get; set; }
    public int ScoreTeam2 { get; set; }
    public Team? Team1 { get; set; }
    public Team? Team2 { get; set; }
    public List<Player> Players = new();

    public string Status { get; set; } = "Scheduled";

    public Game(DateTime date, string location)
    {
        Date = date; 
        Location = location;
    }
}
