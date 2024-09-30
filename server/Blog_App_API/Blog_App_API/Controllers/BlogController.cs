using Blog_App_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Reflection.Metadata;

namespace Blog_App_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _web;
        public BlogController(MyDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment web)
        {
            _context = context;
            _userManager = userManager;
            _web = web;
        }

        [HttpPost]
        [Route("BlogsCreate")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBlog([FromForm] BlogModels model, IFormFile BlogImage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.Claims.FirstOrDefault(x => x.Type == "userId")?.Value;
            if (userId == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest(new { message = "User ID not found." });
            }



            var path = Path.Combine(_web.WebRootPath, "Blog/blog_images/");
            var fileName = Path.GetFileName(BlogImage.FileName);
            var ds = DateTime.Now.Millisecond;
            var imageName = "blog_" + ds + fileName;
            var filePath = Path.Combine(path, imageName);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            using (FileStream stream = new FileStream(filePath, FileMode.Create))
            {
                await BlogImage.CopyToAsync(stream);
            }


            BlogCat blogCat = new BlogCat
            {
                Blog_Category = model.Blog_Category
            };

            _context.BlogCats.Add(blogCat);
            await _context.SaveChangesAsync();

            Blog blog = new Blog
            {
                Content = model.Content,
                UserId = user.Id,
                Blog_Cat_Id = blogCat.Blog_Cat_Id,
                BlogImage = imageName,
                blog_cat = blogCat.Blog_Category,
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog created successfully!" });
        }

        [HttpGet]
        [Route("BlogsDisplayByToken")]

        public async Task<IActionResult> BlogsDisplayByToken()
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "userId")?.Value;
            if (userId == null)
            {
                return BadRequest(new { message = "User Id Not Found" });
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new { message = "User Nor FOund!" });
            }

            var fetchBlogByUserId = (from blog in _context.Blogs
                                     join blogCat in _context.BlogCats on blog.Blog_Cat_Id equals blogCat.Blog_Cat_Id
                                     where blog.UserId == user.Id
                                     select new
                                     {
                                         Id = blog.Id,
                                         Content = blog.Content,
                                         CatName = blogCat.Blog_Category,
                                         BlogId = blogCat.Blog_Cat_Id,
                                         BlogImage = blog.BlogImage
                                     }).ToList();
            return Ok(fetchBlogByUserId);
        }

        [HttpGet]
        [Route("DisplayBlogs")]
        public IActionResult DisplayBlogs()
        {
            var blogs = (
                from blog in _context.Blogs
                join blogCat in _context.BlogCats on blog.Blog_Cat_Id equals blogCat.Blog_Cat_Id
                select new
                {
                    Id = blog.Id,
                    Content = blog.Content,
                    Image = blog.BlogImage,
                    BlogCatId = blogCat.Blog_Cat_Id,
                    BlogCategory = blogCat.Blog_Category,
                }).OrderByDescending(x => x.Id).ToList();
            return Ok(blogs);
        }

        [HttpGet]
        [Route("DisplayCategory")]
        public IActionResult DisplayCategory()
        {
            var category = _context.BlogCats.Select(x => x.Blog_Category).Distinct().ToList();
            return Ok(category);
        }

        [HttpGet]
        [Route("DisplayBlogsByCategory")]
        public IActionResult DisplayBlogsByCategory(string category)
        {
            var filteredCategory = _context.Blogs.Where(x => x.blog_cat == category).ToList();
            return Ok(filteredCategory);
        }

        [HttpGet]
        [Route("DisplayBlogsById")]
        public IActionResult DisplayBlogsById(int id)
        {
            var data = (from blog in _context.Blogs
                        join blogCat in _context.BlogCats on blog.Blog_Cat_Id equals blogCat.Blog_Cat_Id
                        where blog.Blog_Cat_Id == id
                        select new
                        {
                            Id = blog.Id,
                            blogContent = blog.Content,
                            blogImage = blog.BlogImage,
                            blogCategory = blogCat.Blog_Category,
                            blogCatId = blogCat.Blog_Cat_Id
                        }).ToList().FirstOrDefault();
            return Ok(data);
        }

        [HttpPut]
        [Route("BlogsUpdate")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBlog([FromForm] BlogModels model, IFormFile BlogImage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.Claims.FirstOrDefault(x => x.Type == "userId")?.Value;
            if (userId == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest(new { message = "User ID not found." });
            }

            var existingBlog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == model.Id);
            if (existingBlog == null)
            {
                return NotFound(new { message = "Blog not found." });
            }

            var blogCat = await _context.BlogCats.FirstOrDefaultAsync(c => c.Blog_Cat_Id == model.Blog_Cat_Id);
            if (blogCat == null)
            {
                return NotFound(new { message = "Blog category not found." });
            }

            blogCat.Blog_Category = model.Blog_Category;
            _context.BlogCats.Update(blogCat);
            await _context.SaveChangesAsync();

            if (BlogImage != null)
            {
                var path = Path.Combine(_web.WebRootPath, "Blog/blog_images/");
                var fileName = Path.GetFileName(BlogImage.FileName);
                var ds = DateTime.Now.Millisecond;
                var imageName = "blog_" + ds + fileName;
                var filePath = Path.Combine(path, imageName);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    await BlogImage.CopyToAsync(stream);
                }

                existingBlog.BlogImage = imageName;
            }

            existingBlog.Content = model.Content;
            existingBlog.Blog_Cat_Id = blogCat.Blog_Cat_Id;
            existingBlog.blog_cat = blogCat.Blog_Category;

            _context.Blogs.Update(existingBlog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog updated successfully!" });
        }

        [HttpDelete]
        [Route("DeleteBlog")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await (from blogs in _context.Blogs join blogCats in _context.BlogCats on blogs.Blog_Cat_Id equals blogCats.Blog_Cat_Id where blogs.Blog_Cat_Id == id select blogs).FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(blog.BlogImage))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Blog/blog_images/", blog.BlogImage);

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Blog Deleted SuccessFully!" });
        }

        [HttpGet]
        [Route("BlogDetail")]
        public async Task<IActionResult> BlogDetail(int blogId)
        {
            var blog = await (from blogs in _context.Blogs
                        join blogCat in _context.BlogCats on blogs.Blog_Cat_Id equals blogCat.Blog_Cat_Id
                        where blogs.Blog_Cat_Id == blogId
                        select new
                        {
                            BlogId = blogs.Blog_Cat_Id,
                            Content = blogs.Content,
                            BlogImage = blogs.BlogImage,
                            BlogCategory = blogCat.Blog_Category
                        }).FirstOrDefaultAsync();
            return Ok(blog);
        }



    }
}
