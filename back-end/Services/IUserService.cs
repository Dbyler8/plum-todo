using back_end.DTOs;

namespace back_end.Services;

public interface IUserService
{
    Task<List<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(int id);
    Task<UserResponseDto> CreateAsync(UserWriteDto dto);
    Task<UserResponseDto?> UpdateAsync(int id, UserWriteDto dto);
    Task<UserResponseDto?> PatchAsync(int id, UserPatchDto dto);
    Task<bool> DeleteAsync(int id);
}
