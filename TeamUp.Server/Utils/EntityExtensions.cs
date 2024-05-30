using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public static class EntityExtensions
{
    public static PlayerDto AsDto(this Player player)
    {
        return new PlayerDto(
            player.Id,
            player.FirstName,
            player.LastName,
            player.Email,
            player.nickName,
            player.DOB,
            player.Rating
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
            game.Team1?.AsDto(),
            game.Team2?.AsDto(),
            game.Status,
            game.Players.Select(p => p.AsDto()).ToList()
        );
    }

    public static TeamDto AsDto(this Team team)
    {
        return new TeamDto(
            team.Id,
            team.Name,
            team.Players.Select(p => p.AsDto()).ToList()
        );
    }



}
