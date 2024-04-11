namespace TeamUp.Server.Utils;

public class Errors
{
    public static class Player
    {
        public static Error NameIsTaken(string name)
        {
            return new Error("player.name.is.taken", $"Player '{name}' is taken");
        }
        public static Error EmailIsInvalid() =>
            new Error("email.format.invalid", "Invalid email format.");

        public static Error AgeIsInvalid() =>
            new Error("age.invalid.format", "The entered value for age is not a valid number.");

        public static Error NegativeValue() =>
            new Error("negative.value", "Age cannot be negative.");

        public static Error MaxAge() =>
            new Error("age.max.limit", "The provided age exceeds the maximum allowed age of 100 years.");
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

        public static Error ValueIsTooLong(int maxLength) =>
            new Error("value.too.long", $"Value cannot be longer than {maxLength} characters.");

        public static Error ValueIsTooShort(int minLength) =>
            new Error("value.too.short", $"Value cannot be shorter than {minLength} characters.");

    }
}
