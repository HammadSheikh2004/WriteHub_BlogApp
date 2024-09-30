using System.ComponentModel.DataAnnotations;

namespace Blog_App_API.Models
{
    public class BlogModels
    {
        public string Blog_Category { get; set; }
        public string Content { get; set; }

        public int Id { get; set; }
        public int Blog_Cat_Id { get; set; }
    }
}
