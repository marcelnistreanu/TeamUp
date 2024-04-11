namespace TeamUp.Server.Utils;

internal class Envelope
{
    public Result result { get; set; }
    public string errorCode { get; set; }
    public string errorMessage { get; set; }
    public string invalidField { get; set; }
    public DateTime timeGenerated { get; set; }
    public Envelope(Result result, string errorCode, string errorMessage, string invalidField, DateTime timeGenerated)
    {
        this.result = result;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.invalidField = invalidField;
        this.timeGenerated = timeGenerated;
    }

    public static Envelope Error(Error error, string fieldName)
    {
        return new Envelope(
            null,
            error.Code,
            error.Message,
            fieldName,
            DateTime.UtcNow
        );
    }
}
