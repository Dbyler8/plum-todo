using back_end.DTOs;

namespace back_end.Services;

public interface ITaskService
{
    Task<List<TaskResponseDto>> GetAllAsync();
    Task<TaskResponseDto?> GetByIdAsync(int id);
    Task<TaskResponseDto> CreateAsync(TaskWriteDto dto);
    Task<TaskResponseDto?> UpdateAsync(int id, TaskWriteDto dto);
    Task<TaskResponseDto?> PatchAsync(int id, TaskPatchDto dto);
    Task<bool> DeleteAsync(int id);
}
