namespace TeamUp.Server.Models;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NickName { get; set; } = string.Empty;
    public int Age { get; set; }
    public int Rating { get; set; }
    public string PreferredGame { get; set; } = string.Empty;
}
