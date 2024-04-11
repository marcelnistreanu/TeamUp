using System.ComponentModel.DataAnnotations;

namespace TeamUp.Server.Utils;

public class EmailAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
            return ValidationResult.Success;

        string email = value as string;
        if (email == null)
            return new ValidationResult(Errors.General.ValueIsRequired().Serialize());

        Result<Email> emailResult = Email.Create(email);

        if (emailResult.IsFailure)
            return new ValidationResult(emailResult.Error.Serialize());

        return ValidationResult.Success;
    }
}
