using System.ComponentModel.DataAnnotations;

namespace TeamUp.Server.Utils;

public record PlayerDto(
    int Id,
    string Name,
    string NickName,
    int Age,
    int Rating,
    string PreferredGame
);


public record CreatePlayerDto(
    [Required]
    string Name,
    string NickName,
    int Age,
    int Rating,
    string PreferredGame
);

public record UpdatePlayerDto(
    [Required]
    string Name,
    string NickName,
    int Age,
    int Rating,
    string PreferredGame
);
