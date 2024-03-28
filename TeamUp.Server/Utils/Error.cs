namespace TeamUp.Server.Utils;

public class Error
{
    public string Code { get; set; }
    public string Message { get; set; }

    internal Error(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public static readonly Error None = new(string.Empty, string.Empty);
}
