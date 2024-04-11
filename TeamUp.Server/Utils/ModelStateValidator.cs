using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;

namespace TeamUp.Server.Utils;

public class ModelStateValidator
{
    public static IActionResult ValidateModelState(ActionContext context)
    {
        (string fieldName, ModelStateEntry entry) = context.ModelState
            .First(x => x.Value.Errors.Count > 0);
        string errorSerialized = entry.Errors[0].ErrorMessage;

        Error error = Error.Deserialize(errorSerialized);
        Envelope envelope = Envelope.Error(error, fieldName);
        var result = new BadRequestObjectResult(envelope);

        return result;
    }
}
