using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Data;
using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public class PlayerService : IPlayerService
{
    private readonly DataContext _context;
    public PlayerService(DataContext context)
    {
        _context = context;
    }

    public async Task<Result<Player>> AddPlayer(Player player)
    {
        _context.Players.Add(player);
        await _context.SaveChangesAsync();
        return Result.Ok<Player>(player, new MessageResponse("Player created successfully."));
    }

    public async Task<Result<Player>> DeletePlayer(int playerId)
    {
        var player = await _context.Players.FindAsync(playerId);
        if (player is null)
            return Result.Failure<Player>(Errors.General.NotFound("Player", playerId));

        _context.Players.Remove(player);

        await _context.SaveChangesAsync();
        return Result.Ok<Player>(null, new MessageResponse($"Player with id '{playerId}' deleted successfully."));
    }

    public async Task<Result<List<Player>>> GetPlayers()
    {
        var players = await _context.Players.ToListAsync();
        if (players is null)
            return Result.Failure<List<Player>>(Errors.General.NotFound("Players"));
        return Result.Ok(players);
    }

    public async Task<Result<Player>> UpdatePlayer(int playerId, Player player)
    {
        var existingPlayer = await _context.Players.FindAsync(playerId);
        if (existingPlayer is null)
            return Result.Failure<Player>(Errors.General.NotFound("Player", playerId));

        existingPlayer.Name = player.Name;
        existingPlayer.NickName = player.NickName;
        existingPlayer.Age = player.Age;
        existingPlayer.Rating = player.Rating;
        existingPlayer.PreferredGame = player.PreferredGame;

        await _context.SaveChangesAsync();
        return Result.Ok<Player>(existingPlayer, new MessageResponse("Player updated successfully."));
    }
}
