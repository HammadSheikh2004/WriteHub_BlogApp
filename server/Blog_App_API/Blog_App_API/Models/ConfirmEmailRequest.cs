namespace Blog_App_API.Models
{
    public class ConfirmEmailRequest
    {
        public string UserId { get; set; }
        public string Token { get; set; }
    }
}
