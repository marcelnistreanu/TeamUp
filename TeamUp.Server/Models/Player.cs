using TeamUp.Server.Utils;

namespace TeamUp.Server.Models;

public class Player
{
    public int Id { get; set; }

    [NameAttribute]
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? nickName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public int Rating { get; set; }
}
