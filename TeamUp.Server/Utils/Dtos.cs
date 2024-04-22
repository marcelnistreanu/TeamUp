using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public record PlayerDto(
    int Id,
    string Name,
    string Email,
    string? nickName,
    int? Age,
    int Rating
);


public record CreatePlayerDto(
    [NameAttribute]
    string Name,
    [EmailAttribute]
    string Email,
    string? nickName,
    [AgeAttribute]
    int? Age,
    int Rating
);

public record UpdatePlayerDto(
    [NameAttribute]
    string Name,
    [EmailAttribute]
    string Email,
    string? nickName,
    [AgeAttribute]
    int? Age,
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
    string Status
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
