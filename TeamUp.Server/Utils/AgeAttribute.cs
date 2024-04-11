using System.ComponentModel.DataAnnotations;

namespace TeamUp.Server.Utils;

public class AgeAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
            return ValidationResult.Success;

        int age = (int)value;

        Result<Age> ageResult = Age.Create(age);

        if (ageResult.IsFailure)
            return new ValidationResult(ageResult.Error.Serialize());

        return ValidationResult.Success;
    }
}
