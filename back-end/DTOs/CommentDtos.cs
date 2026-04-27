using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public record CommentResponseDto(
    int Id,
    int TaskId,
    int UserId,
    string Content,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CommentWriteDto(
    [Range(1, int.MaxValue)] int TaskId,
    [Range(1, int.MaxValue)] int UserId,
    [Required, StringLength(1000, MinimumLength = 1)] string Content
);

public record CommentPatchDto(
    [StringLength(1000, MinimumLength = 1)] string? Content = null
);
