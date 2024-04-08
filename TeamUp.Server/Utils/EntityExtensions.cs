using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public static class EntityExtensions
{
    public static PlayerDto AsDto(this Player player)
    {
        return new PlayerDto(
            player.Id,
            player.Name,
            player.Email,
            player.nickName,
            player.Age,
            player.Rating
        );
    }
}
