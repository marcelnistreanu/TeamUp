namespace TeamUp.Server.Utils;

public class MessageResponse
{
    public string? Message { get; set; }

    public MessageResponse(string message)
    {
        Message = message;
    }

        public MessageResponse()
    {

    }
}
