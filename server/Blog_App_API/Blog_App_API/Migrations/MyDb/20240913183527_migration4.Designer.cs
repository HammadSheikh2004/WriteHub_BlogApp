﻿// <auto-generated />
using Blog_App_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Blog_App_API.Migrations.MyDb
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20240913183527_migration4")]
    partial class migration4
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.33")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Blog_App_API.Models.Blog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("BlogImage")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Blog_Cat_Id")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("Blog_Cat_Id");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("Blog_App_API.Models.BlogCat", b =>
                {
                    b.Property<int>("Blog_Cat_Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Blog_Cat_Id"), 1L, 1);

                    b.Property<string>("Blog_Category")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Blog_Cat_Id");

                    b.ToTable("BlogCats");
                });

            modelBuilder.Entity("Blog_App_API.Models.Blog", b =>
                {
                    b.HasOne("Blog_App_API.Models.BlogCat", "BlogCat")
                        .WithMany("Blogs")
                        .HasForeignKey("Blog_Cat_Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlogCat");
                });

            modelBuilder.Entity("Blog_App_API.Models.BlogCat", b =>
                {
                    b.Navigation("Blogs");
                });
#pragma warning restore 612, 618
        }
    }
}
