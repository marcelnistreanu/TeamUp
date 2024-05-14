using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IGameService
{
    Task<Result<List<GameDto>>> GetGames();
    Task<Result<Game>> AddGame(CreateGameDto gameDto);
    Task<Result<Game>> UpdateGame(int gameId, UpdateGameDto gameDto);
    Task<Result<Game>> DeleteGame(int gameId);
    Task<Result<Game>> AddPlayersToGame(int gameId, AddPlayersToGameDto gameDto);
    Task<Result<Game>> GetGameById(int gameId);
    Task<Result<Game>> GenerateTeams(int gameId);
}
