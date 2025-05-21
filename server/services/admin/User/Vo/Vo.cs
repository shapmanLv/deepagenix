using System.ComponentModel.DataAnnotations;

namespace DeepAgenix.Admin.User;
public record TokenVo(string accessToken, string refreshToken , DateTime expiresAtUtc);
public record LoginVo([Required]string? username, [Required]string? password);