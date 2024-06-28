using TeamUp.Server.Models;

public class PlayerRatingHistory
{
    public int Id { get; set; }
    public Player Player { get; set; }
    public Game Game { get; set; }
    public int Rating { get; set; }
    public DateTime ChangeDate { get; set; }
}