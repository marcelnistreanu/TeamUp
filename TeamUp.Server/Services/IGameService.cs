﻿using TeamUp.Server.Models;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Services;

public interface IGameService
{
    Task<Result<List<GameDetailsDto>>> GetGames();
    Task<Result<Game>> AddGame(CreateGameDto gameDto);
    Task<Result<Game>> UpdateGame(int gameId, UpdateGameDto gameDto);
    Task<Result<Game>> DeleteGame(int gameId);
    Task<Result<Game>> AddPlayersToGame(int gameId, AddPlayersToGameDto gameDto);
    Task<Result<Game>> GetGameById(int gameId);
    Task<Result<Game>> UpdateGameTeams(int gameId, UpdateTeamsDto gameDto);
    Task<Result<GameDetailsDto>> GetGameDetails(int gameId);
    Task<Result<Game>> ResetTeams(int gameId);
    Task<Result<Game>> RevertGame(int gameId);

}
