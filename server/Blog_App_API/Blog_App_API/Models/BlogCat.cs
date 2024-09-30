using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blog_App_API.Models
{
    public class BlogCat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Blog_Cat_Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Blog_Category { get; set; }

        // Navigation property for the related blogs
        public ICollection<Blog> Blogs { get; set; }
    }
}
