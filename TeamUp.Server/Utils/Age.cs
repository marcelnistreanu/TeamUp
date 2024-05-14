using System.Text.RegularExpressions;

namespace TeamUp.Server.Utils;

public class Age
{
    public int Value { get; }

    private Age(int value)
    {
        Value = value;
    }

    public static Result<Age> Create(int input)
    {
        int age = input;

        // if (!(input is int))
        //     return Result.Failure<Age>(Errors.Player.AgeIsInvalid());

        if (age < 0)
            return Result.Failure<Age>(Errors.Player.NegativeValue());

        if (age > 100)
            return Result.Failure<Age>(Errors.Player.MaxAge());

        return Result.Ok(new Age(age));
    }
}
