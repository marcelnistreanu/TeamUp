using System.ComponentModel.DataAnnotations;

namespace TeamUp.Server.Utils;

public class NameAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
            return ValidationResult.Success;

        string name = value as string;
        if (name == null)
            return new ValidationResult(Errors.General.ValueIsRequired().Serialize());

        Result<Name> nameResult = Name.Create(name);

        if (nameResult.IsFailure)
            return new ValidationResult(nameResult.Error.Serialize());

        return ValidationResult.Success;
    }
}
