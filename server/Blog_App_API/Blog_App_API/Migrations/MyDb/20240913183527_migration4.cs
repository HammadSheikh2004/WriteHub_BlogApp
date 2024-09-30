using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog_App_API.Migrations.MyDb
{
    public partial class migration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BlogImage",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlogImage",
                table: "Blogs");
        }
    }
}
