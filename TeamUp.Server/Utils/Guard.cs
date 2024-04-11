namespace TeamUp.Server.Utils;

public static class Guard
{
    public static void Require(bool condition, string errorMessage)
    {
        if (!condition)
        {
            throw new ArgumentException(errorMessage);
        }
    }
}
