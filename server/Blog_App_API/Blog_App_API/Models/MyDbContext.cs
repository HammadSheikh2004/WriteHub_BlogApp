using Microsoft.EntityFrameworkCore;

namespace Blog_App_API.Models
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {

        }

        public DbSet<BlogCat> BlogCats { get; set; }
        public DbSet<Blog> Blogs { get; set; }

    }
}
