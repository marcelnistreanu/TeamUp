using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public record PlayerDto(
    int Id,
    string Name,
    string Email,
    string? nickName,
    DateTime? DOB,
    int Rating,
    List<Game> Games
);


public record CreatePlayerDto(
    [NameAttribute]
    string Name,
    [EmailAttribute]
    string Email,
    string? nickName,
    // [AgeAttribute]
    DateTime? DOB,
    int Rating
);

public record UpdatePlayerDto(
    [NameAttribute]
    string Name,
    [EmailAttribute]
    string Email,
    string? nickName,
    // [AgeAttribute]
    DateTime? DOB,
    int Rating
);

public record GameDto(
    int Id,
    DateTime Date,
    string Location,
    int ScoreTeam1,
    int ScoreTeam2,
    Team? Team1,
    Team? Team2,
    string Status,
    List<Player> Players
);

public record CreateGameDto(
    DateTime Date,
    string Location
);

public record UpdateGameDto(
    DateTime Date,
    string Location,
    int ScoreTeam1,
    int ScoreTeam2,
    Team? Team1,
    Team? Team2,
    string Status
);

public record AddPlayersToGameDto(
    List<Player> Players
);
