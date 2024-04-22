using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IGameService
{
    Task<Result<List<GameDto>>> GetGames();
    Task<Result<Game>> AddGame(CreateGameDto gameDto);
    Task<Result<Game>> UpdateGame(int gameId, UpdateGameDto gameDto);
    Task<Result<Game>> DeleteGame(int gameId);
}
