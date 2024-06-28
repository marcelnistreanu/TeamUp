using Microsoft.EntityFrameworkCore;
using TeamUp.Server.Data;
using TeamUp.Server.Migrations;
using TeamUp.Server.Models;
using TeamUp.Server.Utils;
using static TeamUp.Server.Utils.Errors;

namespace TeamUp.Server.Services;

public class GameService : IGameService
{
    private readonly DataContext _context;
    public GameService(DataContext context)
    {
        _context = context;
    }

    public async Task<Result<Models.Game>> AddGame(CreateGameDto gameDto)
    {
        Models.Game game = new(gameDto.Date, gameDto.Location);

        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Models.Game>(game, new MessageResponse("Game created successfully."));
    }

    public async Task<Result<Models.Game>> DeleteGame(int gameId)
    {
        var game = await _context.Games.FindAsync(gameId);
        if (game is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return Result.Ok<Models.Game>(null, new MessageResponse("Game deleted successfully."));
    }

    public async Task<Result<List<GameDetailsDto>>> GetGames()
    {

        var games = await _context.Games
            .Include(g => g.Players)
            .Include(g => g.Team1).ThenInclude(t => t != null ? t.Players : null)
            .Include(g => g.Team2).ThenInclude(t => t != null ? t.Players : null)
            .ToListAsync();

        if (games is null)
            return Result.Failure<List<GameDetailsDto>>(Errors.General.NotFound("Games"));


        var gamesDto = games.Select(game => new GameDetailsDto(
            Id: game.Id,
            Date: game.Date,
            Location: game.Location,
            ScoreTeam1: game.ScoreTeam1,
            ScoreTeam2: game.ScoreTeam2,
            Team1: game.Team1 != null ? new TeamWithBasicPlayerDto(
                Id: game.Team1.Id,
                Name: game.Team1.Name ?? null,
                Players: game.Team1.Players.Select(p => new BasicPlayerDto(
                    Id: p.Id,
                    FirstName: p.FirstName,
                    LastName: p.LastName,
                    Email: p.Email,
                    Rating: p.Rating
                )).ToList()
            ) : null,
            Team2: game.Team2 != null ? new TeamWithBasicPlayerDto(
                Id: game.Team2!.Id,
                Name: game.Team2.Name ?? null,
                Players: game.Team2.Players.Select(p => new BasicPlayerDto(
                    Id: p.Id,
                    FirstName: p.FirstName,
                    LastName: p.LastName,
                    Email: p.Email,
                    Rating: p.Rating
                )).ToList()
            ) : null,
            Status: game.Status,
            Players: game.Players.Select(p => new BasicPlayerDto(
                Id: p.Id,
                FirstName: p.FirstName,
                LastName: p.LastName,
                Email: p.Email,
                Rating: p.Rating
            )).ToList()
        )).ToList();

        return Result.Ok(gamesDto);
    }

    public async Task<Result<GameDetailsDto>> GetGameDetails(int gameId)
    {
        var game = await _context.Games
                .Include(g => g.Players)
                .Include(g => g.Team1).ThenInclude(t => t!.Players)
                .Include(g => g.Team2).ThenInclude(t => t!.Players)
                .FirstOrDefaultAsync(g => g.Id == gameId);

        if (game is null)
            return Result.Failure<GameDetailsDto>(Errors.General.NotFound("Game"));


        var team1 = game.Team1;
        var team2 = game.Team2;

        if (team1 is null || team2 is null)
        {
            string teamNotFound = team1 is null ? "Team1" : "Team2";
            return Result.Failure<GameDetailsDto>(Errors.General.NotFound(teamNotFound));
        }


        var gameDto = new GameDetailsDto(
            Id: game.Id,
            Date: game.Date,
            Location: game.Location,
            ScoreTeam1: game.ScoreTeam1,
            ScoreTeam2: game.ScoreTeam2,
            Status: game.Status,
            Team1: game.Team1 != null ? new TeamWithBasicPlayerDto(
                Id: team1!.Id,
                Name: team1.Name ?? null,
                Players: team1.Players.Select(p => new BasicPlayerDto(
                    Id: p.Id,
                    FirstName: p.FirstName,
                    LastName: p.LastName,
                    Email: p.Email,
                    Rating: p.Rating
                )).ToList()
            ) : null,
            Team2: team2 != null ? new TeamWithBasicPlayerDto(
                Id: team2!.Id,
                Name: team2.Name ?? null,
                Players: team2.Players.Select(p => new BasicPlayerDto(
                    Id: p.Id,
                    FirstName: p.FirstName,
                    LastName: p.LastName,
                    Email: p.Email,
                    Rating: p.Rating
                )).ToList()
            ) : null,
            Players: game.Players.Select(p => new BasicPlayerDto(
                Id: p.Id,
                FirstName: p.FirstName,
                LastName: p.LastName,
                Email: p.Email,
                Rating: p.Rating
            )).ToList()
        );

        return Result.Ok(gameDto);
    }

    public async Task<Result<Models.Game>> UpdateGame(int gameId, UpdateGameDto gameDto)
    {
        var existingGame = await _context.Games
            .Include(g => g.Team1).ThenInclude(t => t.Players)
            .Include(g => g.Team2).ThenInclude(t => t.Players)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (existingGame is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        existingGame.Date = gameDto.Date;
        existingGame.Location = gameDto.Location;
        existingGame.ScoreTeam1 = gameDto.ScoreTeam1;
        existingGame.ScoreTeam2 = gameDto.ScoreTeam2;
        
        existingGame.Status = gameDto.Status ?? "Completed";

        var playerRatingHistories = new List<PlayerRatingHistory>();

        // store ratings before update
        foreach (var player in existingGame.Team1?.Players)
        {
            var existingHistory = await _context.PlayerRatingHistory
                .FirstOrDefaultAsync(h => h.Player.Id == player.Id && h.Game.Id == existingGame.Id);

            if (existingHistory == null)
            {
                var history = new PlayerRatingHistory
                {
                    Player = player,
                    Game = existingGame,
                    Rating = player.Rating,
                    ChangeDate = DateTime.UtcNow
                };
                playerRatingHistories.Add(history);
            }
            else
            {
                existingHistory.Rating = player.Rating;
                existingHistory.ChangeDate = DateTime.UtcNow;
            }

        }

        foreach (var player in existingGame.Team2?.Players)
        {
            var existingHistory = await _context.PlayerRatingHistory
                .FirstOrDefaultAsync(h => h.Player.Id == player.Id && h.Game.Id == existingGame.Id);

            if (existingHistory == null)
            {
                var history = new PlayerRatingHistory
                {
                    Player = player,
                    Game = existingGame,
                    Rating = player.Rating,
                    ChangeDate = DateTime.UtcNow
                };
                playerRatingHistories.Add(history);
            }
            else
            {
                existingHistory.Rating = player.Rating;
                existingHistory.ChangeDate = DateTime.UtcNow;
            }
        }

        _context.PlayerRatingHistory.AddRange(playerRatingHistories);

        UpdatePlayerRating(existingGame.Team1?.Players, gameDto.ScoreTeam1 > gameDto.ScoreTeam2);
        UpdatePlayerRating(existingGame.Team2?.Players, gameDto.ScoreTeam2 > gameDto.ScoreTeam1);

        await _context.SaveChangesAsync();
        return Result.Ok<Models.Game>(existingGame, new MessageResponse("Game updated successfully."));
    }

    private void UpdatePlayerRating(List<Models.Player>? players, bool winningTeam)
    {
        if (players != null)
        {
            foreach (var player in players)
            {
                if (winningTeam)
                {
                    player.Rating += 150;
                }
                else
                {
                    player.Rating -= 150;
                }
            }
        }
    }

    public async Task<Result<Models.Game>> RevertGame(int gameId)
    {
        var existingGame = await _context.Games
            .Include(g => g.Team1).ThenInclude(t => t.Players)
            .Include(g => g.Team2).ThenInclude(t => t.Players)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (existingGame == null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        var previousRatings = await _context.PlayerRatingHistory
            .Where(h => h.Game.Id == gameId)
            .ToListAsync();

        foreach (var history in previousRatings)
        {
            var player = history.Player;
            player.Rating = history.Rating;
        }

        existingGame.ScoreTeam1 = 0;
        existingGame.ScoreTeam2 = 0;
        existingGame.Status = "Reverted";

        await _context.SaveChangesAsync();

        return Result.Ok(existingGame);
    }

    public async Task<Result<Models.Game>> AddPlayersToGame(int gameId, AddPlayersToGameDto gameDto)
    {
        var existingGame = await _context.Games
            .Include(g => g.Players)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (existingGame is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        // Get current players associated with the game
        var currentPlayers = existingGame.Players.ToList();

        // Remove players who are not selected
        var playersToRemove = currentPlayers.Where(player => !gameDto.Players.Any(p => p.Id == player.Id)).ToList();
        foreach (var player in playersToRemove)
        {
            // currentPlayers.Remove(player);
            existingGame.Players.Remove(player);
            player.Games ??= new List<Models.Game>();
            player.Games.Remove(existingGame);
        }

        // Add players who are selected but not currently associated with the game
        foreach (var playerDto in gameDto.Players)
        {
            if (!currentPlayers.Any(cp => cp.Id == playerDto.Id))
            {
                var player = await _context.Players.FindAsync(playerDto.Id);
                if (player != null)
                {
                    existingGame.Players.Add(player);
                    player.Games ??= new List<Models.Game>();
                    player.Games.Add(existingGame);
                }
            }
        }

        var updatedPlayers = existingGame.Players.ToList();
        await _context.SaveChangesAsync();

        if (updatedPlayers.ToHashSet().SetEquals(currentPlayers))
            return Result.Ok<Models.Game>(existingGame, new MessageResponse("No changes were made to the game's players."));
        return Result.Ok<Models.Game>(existingGame, new MessageResponse("Players have been successfully updated in the game."));
    }

    public async Task<Result<Models.Game>> GetGameById(int gameId)
    {
        var game = await _context.Games
            .Include(g => g.Players)
            .Include(g => g.Team1).ThenInclude(t => t.Players)
            .Include(g => g.Team2).ThenInclude(t => t.Players)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (game is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        return Result.Ok<Models.Game>(game, new MessageResponse($"Game with id: {gameId} found."));
    }


    public async Task<Result<Models.Game>> UpdateGameTeams(int gameId, UpdateTeamsDto dto)
    {

        var game = await _context.Games
            // .Include(g => g.Players)
            .Include(g => g.Team1)
            .Include(g => g.Team2)
            // .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == gameId);


        if (game is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));


        // Update Team1 if provided
        if (dto.Team1 != null)
        {

            var newTeam1 = new Team
            {
                // Set other properties of the team as needed
                // For example: Name
                Name = dto.Team1.Name
            };

            if (dto.Team1.Players != null && dto.Team1.Players.Any())
            {
                foreach (var playerDto in dto.Team1.Players)
                {
                    var player = await _context.Players.FirstOrDefaultAsync(p => p.Id == playerDto.Id);
                    if (player is not null)
                        newTeam1.Players.Add(player); // Add player to the team
                }
            }
            _context.Teams.Add(newTeam1);
            await _context.SaveChangesAsync();
            game.Team1 = newTeam1;
        }
        else
        {
            game.Team1 = null; // Clear Team1 if not provided
        }

        // Update Team1 if provided
        if (dto.Team2 != null)
        {

            var newTeam2 = new Team
            {
                // Set other properties of the team as needed
                // For example: Name
                Name = dto.Team2.Name
            };

            if (dto.Team2.Players != null && dto.Team2.Players.Any())
            {
                foreach (var playerDto in dto.Team2.Players)
                {
                    var player = await _context.Players.FirstOrDefaultAsync(p => p.Id == playerDto.Id);
                    if (player is not null)
                        newTeam2.Players.Add(player); // Add player to the team
                }
            }
            _context.Teams.Add(newTeam2);
            await _context.SaveChangesAsync();
            game.Team2 = newTeam2;
        }
        else
        {
            game.Team2 = null; // Clear Team1 if not provided
        }

        await _context.SaveChangesAsync();

        return Result.Ok<Models.Game>(game, new MessageResponse("Teams updated."));
    }

    public async Task<Result<Models.Game>> ResetTeams(int gameId)
    {
        var game = await _context.Games
            .Include(g => g.Team1)
            .Include(g => g.Team2)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (game is null)
            return Result.Failure<Models.Game>(Errors.General.NotFound("Game", gameId));

        game.Team1 = null;
        game.Team2 = null;

        await _context.SaveChangesAsync();

        return Result.Ok<Models.Game>(game, new MessageResponse("Teams reset."));
    }
}
