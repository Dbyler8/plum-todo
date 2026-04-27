using back_end.DTOs;

namespace back_end.Services;

public interface ICommentService
{
    Task<List<CommentResponseDto>> GetAllAsync();
    Task<CommentResponseDto?> GetByIdAsync(int id);
    Task<List<CommentResponseDto>> GetByTaskIdAsync(int taskId);
    Task<CommentResponseDto> CreateAsync(CommentWriteDto dto);
    Task<CommentResponseDto?> UpdateAsync(int id, CommentWriteDto dto);
    Task<CommentResponseDto?> PatchAsync(int id, CommentPatchDto dto);
    Task<bool> DeleteAsync(int id);
}
