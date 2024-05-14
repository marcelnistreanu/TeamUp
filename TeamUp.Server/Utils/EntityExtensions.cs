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
            player.DOB,
            player.Rating,
            player.Games
        );
    }

    public static GameDto AsDto(this Game game)
    {
        return new GameDto(
            game.Id,
            game.Date,
            game.Location,
            game.ScoreTeam1,
            game.ScoreTeam2,
            game.Team1,
            game.Team2,
            game.Status,
            game.Players
        );
    }
}
