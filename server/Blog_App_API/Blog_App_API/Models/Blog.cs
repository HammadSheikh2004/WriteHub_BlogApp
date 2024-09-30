using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blog_App_API.Models
{
    public class Blog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string? Content { get; set; }

        [Required]
        public string? BlogImage { get; set; }

        public string? blog_cat { get; set; }

        [Required]
        public string? UserId { get; set; }

        public int Blog_Cat_Id { get; set; }
        [ForeignKey(nameof(Blog_Cat_Id))]
        public BlogCat BlogCat { get; set; }
    }
}
