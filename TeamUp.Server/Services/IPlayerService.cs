using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IPlayerService
{
    Task<Result<List<PlayerDto>>> GetPlayers();
    Task<Result<Player>> AddPlayer(CreatePlayerDto playerDto);
    Task<Result<Player>> UpdatePlayer(int playerId, UpdatePlayerDto playerDto);
    Task<Result<Player>> DeletePlayer(int playerId);
}
