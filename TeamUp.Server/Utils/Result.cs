namespace TeamUp.Server.Utils;

public class Result
{
    public Result(bool isSuccess, Error error, MessageResponse message)
    {
        if (isSuccess && error != Error.None ||
            !isSuccess && error == Error.None)
        {
            throw new ArgumentException("Invalid error", nameof(error));
        }

        IsSuccess = isSuccess;
        Error = error;
        Message = message;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;
    public MessageResponse Message { get; protected set; }


    public Error Error { get; }

    public static Result Success() => new(true, Error.None, null);

    public static Result Failure(Error error) => new(false, error, null);

    public static Result<T> Failure<T>(Error error)
    {
        return new Result<T>(default, false, error, null);
    }

    public static Result<T> Ok<T>(T value)
    {
        return new Result<T>(value, true, Error.None, null);
    }   
    
    public static Result<T> Ok<T>(T? value, MessageResponse message)
    {
        return new Result<T>(value, true, Error.None, message);
    }

    internal static Result<T> Failure<T>(Error error, string fieldName)
    {
        throw new NotImplementedException();
    }
}

public class Result<T> : Result
{
    protected internal Result(T value, bool success, Error error, MessageResponse message)
        : base(success, error, message)
    {
        Value = value;
    }

    public T Value { get; set; }
    public static implicit operator Result<T>(T value) => Ok(value);
}
