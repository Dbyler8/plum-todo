using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public record UserResponseDto(
    int Id,
    string Email,
    string Name,
    string? Title,
    string? Department,
    string? Location,
    string? Phone,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record UserWriteDto(
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    string? Title,
    string? Department,
    string? Location,
    string? Phone,
    [Required, StringLength(100, MinimumLength = 8)] string Password
);

public record UserPatchDto(
    [EmailAddress, StringLength(256)] string? Email = null,
    [StringLength(100, MinimumLength = 2)] string? Name = null,
    string? Title = null,
    string? Department = null,
    string? Location = null,
    string? Phone = null,
    [StringLength(100, MinimumLength = 8)] string? Password = null
);
