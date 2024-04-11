using System.Text.RegularExpressions;

namespace TeamUp.Server.Utils;

public class Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Result<Email> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return Result.Failure<Email>(Errors.General.ValueIsRequired());

        string email = input.Trim();

        if (!Regex.IsMatch(email, @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}))$"))
        {
            return Result.Failure<Email>(Errors.Player.EmailIsInvalid());
        }

        return Result.Ok(new Email(email));

    }
}
