using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IGameService
{
    Task<Result<List<Game>>> GetGames();
    Task<Result<Game>> AddGame(Game game);
    Task<Result<Game>> UpdateGame(int gameId, Game game);
    Task<Result<Game>> DeleteGame(int gameId);
}
