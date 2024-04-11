using System.ComponentModel.DataAnnotations;

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
