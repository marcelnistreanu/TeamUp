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

    public async Task<Result<Game>> AddGame(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Game>(game, new MessageResponse("Game created successfully."));
    }

    public async Task<Result<Game>> DeleteGame(int gameId)
    {
        var game = await _context.Games.FindAsync(gameId);
        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Game>(null, new MessageResponse("Game deleted successfully."));
    }

    public async Task<Result<List<Game>>> GetGames()
    {
        var games = await _context.Games.ToListAsync();
        return Result.Ok(games);
    }

    public async Task<Result<Game>> UpdateGame(int gameId, Game game)
    {
        throw new NotImplementedException();
    }
}
