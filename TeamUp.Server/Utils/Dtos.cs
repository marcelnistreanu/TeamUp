using TeamUp.Server.Models;

namespace TeamUp.Server.Utils;

public record PlayerDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string? nickName,
    DateTime? DOB,
    int Rating
);


public record CreatePlayerDto(
    // [NameAttribute]
    string FirstName,
    string LastName,
    [EmailAttribute]
    string Email,
    string? nickName,
    // [AgeAttribute]
    DateTime? DOB,
    int Rating
);

public record UpdatePlayerDto(
    // [NameAttribute]
    string FirstName,
    string LastName,
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
    TeamDto? Team1,
    TeamDto? Team2,
    string Status,
    List<PlayerDto> Players
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
    TeamDto? Team1,
    TeamDto? Team2,
    string Status
);

public record AddPlayersToGameDto(
    List<PlayerDto> Players
);

public record UpdateTeamsDto(
    TeamDto? Team1,
    TeamDto? Team2
);

public record TeamDto(
    int Id,
    string? Name,
    List<PlayerDto> Players
);

public record GameWithBasicTeamDto(
    int Id,
    DateTime Date,
    string Location,
    int ScoreTeam1,
    int ScoreTeam2,
    BasicTeamDto? Team1,
    BasicTeamDto? Team2,
    string Status
);

public record BasicTeamDto(
    int Id,
    string? Name
);

public record BasicPlayerDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    int Rating
);

public record TeamWithBasicPlayerDto(
    int Id,
    string? Name,
    List<BasicPlayerDto> Players
);

public record GameDetailsDto(
    int Id,
    DateTime Date,
    string Location,
    int ScoreTeam1,
    int ScoreTeam2,
    string Status,
    TeamWithBasicPlayerDto? Team1,
    TeamWithBasicPlayerDto? Team2,
    List<BasicPlayerDto> Players
);



