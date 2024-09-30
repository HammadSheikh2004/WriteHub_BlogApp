using Blog_App_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace Blog_App_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private IConfiguration _config;
        private readonly IWebHostEnvironment _web;

        public AuthenticationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration config, IWebHostEnvironment web)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
            _web = web;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<Object> RegisterUser(RegisterModel registerModel)
        {
            var applicationUser = new ApplicationUser
            {
                UserName = registerModel.UserName,
                Email = registerModel.Email,
                FullName = registerModel.FullName
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, registerModel.Password);
                if (result.Succeeded)
                {
                    if (!await _roleManager.RoleExistsAsync("User"))
                    {
                        await _roleManager.CreateAsync(new IdentityRole("User"));
                    }
                    await _userManager.AddToRoleAsync(applicationUser, "User");

                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(applicationUser);

                    var angularAppBaseUrl = "http://localhost:4200";
                    var encodedToken = WebUtility.UrlEncode(token);
                    var callbackUrl = $"{angularAppBaseUrl}/confirmEmail?UserId={applicationUser.Id}&Token={encodedToken}";
                    var emailMessage = $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.";

                    var emailSent = await SendEmailAsync(applicationUser.Email, "Confirm Your Email", emailMessage);
                    if (emailSent)
                    {
                        return Ok(new { result, message = "Registration successful, please confirm your email." });
                    }
                    else
                    {
                        return Ok(new { result, message = "Registration successful, but failed to send confirmation email." });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        private async Task<bool> SendEmailAsync(string email, string subject, string confirmLink)
        {
            try
            {
                MailMessage mailMessage = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();

                mailMessage.From = new MailAddress("YOUR_EMAIL_ADDESS", "WriteHub");
                mailMessage.To.Add(email);
                mailMessage.Subject = subject;
                mailMessage.Body = confirmLink;
                mailMessage.IsBodyHtml = true;

                smtpClient.Host = "smtp.gmail.com";
                smtpClient.Port = 587;
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("YOUR_EMAIL_ADDESS", "APP_CODE");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                await smtpClient.SendMailAsync(mailMessage);
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            var result = await _userManager.ConfirmEmailAsync(user, request.Token);
            if (result.Succeeded)
            {
                return Ok(new { message = "Email confirmed successfully." });
            }
            else
            {
                return Ok(new { message = "Email not confirmed successfully." });
            }
        }

        private async Task<string> GenerateJSONWebToken(LoginModel loginModel)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("userId", user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(120),
                SigningCredentials = credentials,
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        [HttpPost]
        [Route("Signin")]
        public async Task<IActionResult> Signin([FromBody] LoginModel loginModel)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    return BadRequest(new { message = "Firstly! Please confirm your Email!" });
                }

                var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                if (isAdmin)
                {
                    var tokenString = await GenerateJSONWebToken(loginModel);
                    return Ok(new { message = "Admin", token = tokenString });
                }
                else
                {
                    var isUserExists = await _userManager.IsInRoleAsync(user, "User");
                    if (!isUserExists)
                    {
                        return BadRequest(new { userRoleError = "You Are anonymous" });
                    }
                    var isUser = await _userManager.IsInRoleAsync(user, "User");
                    if (isUser)
                    {
                        var tokenString = await GenerateJSONWebToken(loginModel);
                        return Ok(new { message = "User", token = tokenString });
                    }
                    else
                    {
                        return BadRequest(new { message = "User is not assigned to any role." });
                    }

                }
            }
            else
            {
                return BadRequest(new { message = "Invalid Email and Password, PLease Try Again" });
            }

        }

        [HttpPost]
        [Route("UpdateProfile")]
        [Authorize(Roles = "Admin, User")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileModel model, IFormFile image)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found in token." });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (image != null && image.Length > 0)
            {
                var path = Path.Combine(_web.WebRootPath, "user_images");
                string fileName = Path.GetFileName(image.FileName);
                var ds = DateTime.Now.Millisecond;
                var imageName = "image_" + ds + fileName;
                var filePath = Path.Combine(path, imageName);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                user.Image = imageName;
            }


            user.UserName = model.UserName;
            user.FullName = model.FullName;
            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Profile updated successfully." });
            }

            return BadRequest(result.Errors);
        }

        [HttpGet]
        [Route("GetUserDetails")]
        public async Task<IActionResult> UserDetails()
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type == "userId")?.Value;
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User Not Found" });
            }
            return Ok(new
            {
                user.UserName,
                user.FullName,
                user.Email,
                user.Image,
            });
        }

    }
}
