using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IPlayerService
{
    Task<Result<List<Player>>> GetPlayers();
    Task<Result<Player>> AddPlayer(Player player);
    Task<Result<Player>> UpdatePlayer(int playerId, Player player);
    Task<Result<Player>> DeletePlayer(int playerId);
}
