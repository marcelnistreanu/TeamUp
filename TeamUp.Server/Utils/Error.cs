using System;

namespace TeamUp.Server.Utils;

public class Error
{
    private const string Separator = "||";
    public string Code { get; set; }
    public string Message { get; set; }

    internal Error(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public static readonly Error None = new(string.Empty, string.Empty);

    public string Serialize()
    {
        return $"{Code}{Separator}{Message}";
    }

    public static Error Deserialize(string serialized)
    {
        string[] data = serialized.Split(
            new[] { Separator },
            StringSplitOptions.RemoveEmptyEntries);

        Guard.Require(data.Length >= 2, $"Invalid error serialization: '{serialized}'");

        return new Error(data[0], data[1]);
    }
}
