using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Data;
using TeamUp.Server.Models;
using TeamUp.Server.Utils;
using static TeamUp.Server.Utils.Errors;

namespace TeamUp.Server.Services;

public class GameService : IGameService
{
    private readonly DataContext _context;
    public GameService(DataContext context)
    {
        _context = context;
    }

    public async Task<Result<Game>> AddGame(CreateGameDto gameDto)
    {
        Game game = new(gameDto.Date, gameDto.Location);

        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Game>(game, new MessageResponse("Game created successfully."));
    }

    public async Task<Result<Game>> DeleteGame(int gameId)
    {
        var game = await _context.Games.FindAsync(gameId);
        if(game is null)
            return Result.Failure<Game>(Errors.General.NotFound("Game", gameId));
            
        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Game>(null, new MessageResponse("Game deleted successfully."));
    }

    public async Task<Result<List<GameDto>>> GetGames()
    {
        var games = await _context.Games.ToListAsync();
        if (games is null)
            return Result.Failure<List<GameDto>>(Errors.General.NotFound("Games"));

        var gamesDto = games.Select(game => new GameDto(
            Id: game.Id,
            Date: game.Date,
            Location: game.Location,
            ScoreTeam1: game.ScoreTeam1,
            ScoreTeam2: game.ScoreTeam2,
            Team1: game.Team1,
            Team2: game.Team2,
            Status: game.Status
        )).ToList();

        return Result.Ok(gamesDto);
    }

    public async Task<Result<Game>> UpdateGame(int gameId, UpdateGameDto gameDto)
    {
        var existingGame = await _context.Games.FindAsync(gameId);
        if (existingGame is null)
            return Result.Failure<Game>(Errors.General.NotFound("Game", gameId));

        existingGame.Date = gameDto.Date;
        existingGame.Location = gameDto.Location;
        existingGame.ScoreTeam1 = gameDto.ScoreTeam1;
        existingGame.ScoreTeam2 = gameDto.ScoreTeam2;
        existingGame.Team1 = gameDto.Team1;
        existingGame.Team2 = gameDto.Team2;
        existingGame.Status = gameDto.Status;

        await _context.SaveChangesAsync();
        return Result.Ok<Game>(existingGame, new MessageResponse("Game updated successfully."));
    }
}
