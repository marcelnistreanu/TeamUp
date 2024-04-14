namespace TeamUp.Server.Models;

public class Game
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    //public TimeSpan Time { get; set; }
    public string Location { get; set; }
    public int ScoreTeam1 { get; set; }
    public int ScoreTeam2 { get; set; }
    public int? Team1Id { get; set; }
    public Team? Team1 { get; set; }
    public int? Team2Id { get; set; }
    public Team? Team2 { get; set; }
}
