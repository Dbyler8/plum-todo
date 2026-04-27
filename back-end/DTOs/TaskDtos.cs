using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public record TaskResponseDto(
    int Id,
    int UserId,
    string? Tag,
    int? TagColor,
    string Title,
    string? Description,
    string Status,
    DateTime? DueDate,
    string Priority,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record TaskWriteDto(
    [Range(1, int.MaxValue)] int UserId,
    string? Tag,
    [Range(1, 10)] int? TagColor,
    [Required, StringLength(200, MinimumLength = 2)] string Title,
    string? Description,
    [Required, RegularExpression("^(To Do|In Progress|Done|Blocked)$")] string Status,
    DateTime? DueDate,
    [Required, RegularExpression("^(Low|Medium|High)$")] string Priority
);

public record TaskPatchDto(
    [Range(1, int.MaxValue)] int? UserId = null,
    string? Tag = null,
    int? TagColor = null,
    string? Title = null,
    string? Description = null,
    string? Status = null,
    DateTime? DueDate = null,
    string? Priority = null
);
