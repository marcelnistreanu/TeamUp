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

    public async Task<Result<Player>> AddPlayer(CreatePlayerDto playerDto)
    {
        Player player = new()
        {
            Name = playerDto.Name,
            NickName = playerDto.NickName,
            Age = playerDto.Age,
            Rating = playerDto.Rating,
            PreferredGame = playerDto.PreferredGame,
        };
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

    public async Task<Result<List<PlayerDto>>> GetPlayers()
    {
        var players = await _context.Players.ToListAsync();
        if (players is null)
            return Result.Failure<List<PlayerDto>>(Errors.General.NotFound("Players"));

        var playerDtos = players.Select(player => new PlayerDto(
            Id: player.Id,
            Name: player.Name,
            NickName: player.NickName,
            Age: player.Age,
            Rating: player.Rating,
            PreferredGame: player.PreferredGame
        )).ToList();

        return Result.Ok(playerDtos);
    }

    public async Task<Result<Player>> UpdatePlayer(int playerId, UpdatePlayerDto playerDto)
    {
        var existingPlayer = await _context.Players.FindAsync(playerId);
        if (existingPlayer is null)
            return Result.Failure<Player>(Errors.General.NotFound("Player", playerId));

        existingPlayer.Name = playerDto.Name;
        existingPlayer.NickName = playerDto.NickName;
        existingPlayer.Age = playerDto.Age;
        existingPlayer.Rating = playerDto.Rating;
        existingPlayer.PreferredGame = playerDto.PreferredGame;

        await _context.SaveChangesAsync();
        return Result.Ok<Player>(existingPlayer, new MessageResponse("Player updated successfully."));
    }
}
