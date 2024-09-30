using Blog_App_API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog_App_API.Models
{
    public class AuthenticationContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public AuthenticationContext(DbContextOptions<AuthenticationContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Seeding Roles
            builder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "1",
                Name = "Admin",
                NormalizedName = "ADMIN"
            });
            builder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "2",
                Name = "User",
                NormalizedName = "USER"
            });

            // Apply custom configurations
            builder.ApplyConfiguration(new EntityRoleConfiguration());
            builder.ApplyConfiguration(new EntityConfiguration());
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    }
}

// Entity Configuration for ApplicationUser
public class EntityConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FullName)
               .HasMaxLength(255);

        builder.Property(u => u.Image)
               .HasMaxLength(255);
    }
}

// Empty Configuration for IdentityRole (if needed)
public class EntityRoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        // You can add custom role configurations here if needed
    }
}
