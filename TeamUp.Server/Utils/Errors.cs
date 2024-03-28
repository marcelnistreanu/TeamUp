namespace TeamUp.Server.Utils;

public class Errors
{
    public static class Player
    {
        public static Error NameIsTaken(string name)
        {
            return new Error("player.name.is.taken", $"Player '{name}' is taken");
        }
    }

    public static class General
    {
        public static Error NotFound(string entityName, long id)
        {
            return new Error("record.not.found", $"{entityName} not found for Id {id}");
        }

        public static Error NotFound(string entityName)
        {
            return new Error("record.not.found", $"{entityName} not found");
        }

        public static Error ValueIsRequired()
        {
            return new Error("value.required", "Value is required");
        }

        public static Error ValueIsTooLong()
        {
            return new Error("value.too.long", "Value is too long");
        }
    }
}
