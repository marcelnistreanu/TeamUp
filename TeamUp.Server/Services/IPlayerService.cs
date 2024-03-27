using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;

namespace TeamUp.Server.Services;

public interface IPlayerService
{
    Task<List<Player>> GetPlayers();
    Task<Player> AddPlayer(Player player);
    Task<Player> UpdatePlayer(int playerId, Player player);
    Task DeletePlayer(int playerId);
}
