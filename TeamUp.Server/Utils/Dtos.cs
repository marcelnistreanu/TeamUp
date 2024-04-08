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
    [Required]
    string Name,
    string Email,
    string? nickName,
    int? Age,
    int Rating
);

public record UpdatePlayerDto(
    [Required]
    string Name,
    string Email,
    string? nickName,
    int? Age,
    int Rating
);
