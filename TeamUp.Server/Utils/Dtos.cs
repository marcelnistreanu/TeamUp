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
    string Name,
    string NickName,
    int Age,
    int Rating,
    string PreferredGame
);

public record UpdatePlayerDto(
    string Name,
    string NickName,
    int Age,
    int Rating,
    string PreferredGame
);
