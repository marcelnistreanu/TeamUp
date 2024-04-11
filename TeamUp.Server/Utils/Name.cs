namespace TeamUp.Server.Utils;

public class Name
{
    public string Value { get; }

    private Name(string value)
    {
        Value = value;
    }

    public static Result<Name> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return Result.Failure<Name>(Errors.General.ValueIsRequired());

        string name = input.Trim();

        if (name.Length < 3)
            return Result.Failure<Name>(Errors.General.ValueIsTooShort(3));

        if (name.Length > 40)
            return Result.Failure<Name>(Errors.General.ValueIsTooLong(40));

        return Result.Ok(new Name(name));

    }
}
