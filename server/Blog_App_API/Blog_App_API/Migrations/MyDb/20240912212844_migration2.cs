using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog_App_API.Migrations.MyDb
{
    public partial class migration2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogCats_Blogs_blogId",
                table: "BlogCats");

            migrationBuilder.DropIndex(
                name: "IX_BlogCats_blogId",
                table: "BlogCats");

            migrationBuilder.DropColumn(
                name: "blogId",
                table: "BlogCats");

            migrationBuilder.RenameColumn(
                name: "blogId",
                table: "Blogs",
                newName: "Blog_Cat_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_Blog_Cat_Id",
                table: "Blogs",
                column: "Blog_Cat_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_BlogCats_Blog_Cat_Id",
                table: "Blogs",
                column: "Blog_Cat_Id",
                principalTable: "BlogCats",
                principalColumn: "Blog_Cat_Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_BlogCats_Blog_Cat_Id",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_Blog_Cat_Id",
                table: "Blogs");

            migrationBuilder.RenameColumn(
                name: "Blog_Cat_Id",
                table: "Blogs",
                newName: "blogId");

            migrationBuilder.AddColumn<int>(
                name: "blogId",
                table: "BlogCats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BlogCats_blogId",
                table: "BlogCats",
                column: "blogId");

            migrationBuilder.AddForeignKey(
                name: "FK_BlogCats_Blogs_blogId",
                table: "BlogCats",
                column: "blogId",
                principalTable: "Blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
