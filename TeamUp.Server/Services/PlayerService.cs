using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Data;
using TeamUp.Server.Models;

namespace TeamUp.Server.Services;

public class PlayerService : IPlayerService
{
    private readonly DataContext _context;
    public PlayerService(DataContext context)
    {
        _context = context;
    }

    public async Task<Player> AddPlayer(Player player)
    {
        _context.Players.Add(player);
        await _context.SaveChangesAsync();
        return player;
    }

    public async Task DeletePlayer(int playerId)
    {
        var player = await _context.Players.FindAsync(playerId);
        if(player is not null)
            _context.Players.Remove(player);

        await _context.SaveChangesAsync();
    }

    public async Task<List<Player>> GetPlayers()
    {
        return await _context.Players.ToListAsync();
    }

    public async Task<Player> UpdatePlayer(int playerId, Player player)
    {
        var existingPlayer = await _context.Players.FindAsync(playerId);
        if (existingPlayer is null)
            return null;

        existingPlayer.Name = player.Name;
        existingPlayer.NickName = player.NickName;
        existingPlayer.Age = player.Age;
        existingPlayer.Rating = player.Rating;

        await _context.SaveChangesAsync();
        return existingPlayer;
    }
}
