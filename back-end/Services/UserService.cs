using back_end.Data;
using back_end.DTOs;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class UserService(DatabaseMapping db) : IUserService
{
    public async Task<List<UserResponseDto>> GetAllAsync()
    {
        var users = await db.Users.ToListAsync();
        return users.Select(MapToResponse).ToList();
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        return user is null ? null : MapToResponse(user);
    }

    public async Task<UserResponseDto> CreateAsync(UserWriteDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            Name = dto.Name,
            Title = dto.Title,
            Department = dto.Department,
            Location = dto.Location,
            Phone = dto.Phone,
            Password = dto.Password,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return MapToResponse(user);
    }

    public async Task<UserResponseDto?> UpdateAsync(int id, UserWriteDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return null;
        }

        user.Email = dto.Email;
        user.Name = dto.Name;
        user.Title = dto.Title;
        user.Department = dto.Department;
        user.Location = dto.Location;
        user.Phone = dto.Phone;
        user.Password = dto.Password;
        user.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToResponse(user);
    }

    public async Task<UserResponseDto?> PatchAsync(int id, UserPatchDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return null;
        }

        if (dto.Email is not null)
        {
            user.Email = dto.Email;
        }
        if (dto.Name is not null)
        {
            user.Name = dto.Name;
        }
        if (dto.Title is not null)
        {
            user.Title = dto.Title;
        }
        if (dto.Department is not null)
        {
            user.Department = dto.Department;
        }
        if (dto.Location is not null)
        {
            user.Location = dto.Location;
        }
        if (dto.Phone is not null)
        {
            user.Phone = dto.Phone;
        }
        if (dto.Password is not null)
        {
            user.Password = dto.Password;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapToResponse(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return false;
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }

    private static UserResponseDto MapToResponse(User user) =>
        new(
            user.Id,
            user.Email,
            user.Name,
            user.Title,
            user.Department,
            user.Location,
            user.Phone,
            user.CreatedAt,
            user.UpdatedAt
        );
}
