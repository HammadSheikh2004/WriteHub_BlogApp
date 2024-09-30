using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog_App_API.Migrations.MyDb
{
    public partial class migration6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "blog_cat",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "blog_cat",
                table: "Blogs");
        }
    }
}
