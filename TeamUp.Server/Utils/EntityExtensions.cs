using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public static class EntityExtensions
{
    public static PlayerDto AsDto(this Player player)
    {
        return new PlayerDto(
            player.Id,
            player.Name,
            player.NickName,
            player.Age,
            player.Rating,
            player.PreferredGame
        );
    }
}
