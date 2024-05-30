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
        Name firstName = Name.Create(playerDto.FirstName).Value;
        Name lastName = Name.Create(playerDto.LastName).Value;

        Email email = Email.Create(playerDto.Email).Value;

        Player player = new()
        {
            FirstName = firstName.Value,
            LastName = lastName.Value,
            Email = email.Value,
            nickName = playerDto.nickName,
            DOB = playerDto.DOB,
            Rating = 100
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
            FirstName: player.FirstName,
            LastName: player.LastName,
            Email: player.Email,
            nickName: player.nickName,
            DOB: player.DOB,
            Rating: player.Rating
        )).ToList();

        return Result.Ok(playerDtos);
    }

    public async Task<Result<Player>> UpdatePlayer(int playerId, UpdatePlayerDto playerDto)
    {
        var existingPlayer = await _context.Players.FindAsync(playerId);
        if (existingPlayer is null)
            return Result.Failure<Player>(Errors.General.NotFound("Player", playerId));

        Name firstName = Name.Create(playerDto.FirstName).Value;
        Name lastName = Name.Create(playerDto.LastName).Value;

        Email email = Email.Create(playerDto.Email).Value;

        existingPlayer.FirstName = firstName.Value;
        existingPlayer.LastName = lastName.Value;
        existingPlayer.nickName = playerDto.nickName;
        existingPlayer.Email = email.Value;
        existingPlayer.DOB = playerDto.DOB;
        existingPlayer.Rating = playerDto.Rating;

        await _context.SaveChangesAsync();
        return Result.Ok<Player>(existingPlayer, new MessageResponse("Player updated successfully."));
    }
}
