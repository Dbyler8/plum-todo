using back_end.Data;
using back_end.DTOs;
using back_end.Models;
using Microsoft.EntityFrameworkCore;
using TaskEntity = back_end.Models.Task;

namespace back_end.Services;

public class TaskService(DatabaseMapping db) : ITaskService
{
    public async Task<List<TaskResponseDto>> GetAllAsync()
    {
        var tasks = await db.Tasks.ToListAsync();
        return tasks.Select(MapToResponse).ToList();
    }

    public async Task<TaskResponseDto?> GetByIdAsync(int id)
    {
        var task = await db.Tasks.FindAsync(id);
        return task is null ? null : MapToResponse(task);
    }

    public async Task<TaskResponseDto> CreateAsync(TaskWriteDto dto)
    {
        var task = new TaskEntity
        {
            UserId = dto.UserId,
            Tag = dto.Tag,
            TagColor = dto.TagColor,
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            DueDate = dto.DueDate,
            Priority = dto.Priority,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        return MapToResponse(task);
    }

    public async Task<TaskResponseDto?> UpdateAsync(int id, TaskWriteDto dto)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task is null)
        {
            return null;
        }

        task.UserId = dto.UserId;
        task.Tag = dto.Tag;
        task.TagColor = dto.TagColor;
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.DueDate = dto.DueDate;
        task.Priority = dto.Priority;
        task.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToResponse(task);
    }

    public async Task<TaskResponseDto?> PatchAsync(int id, TaskPatchDto dto)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task is null)
        {
            return null;
        }

        if (dto.UserId is not null)
        {
            task.UserId = dto.UserId.Value;
        }
        if (dto.Tag is not null)
        {
            task.Tag = dto.Tag;
        }
        if (dto.TagColor is not null)
        {
            task.TagColor = dto.TagColor;
        }
        if (dto.Title is not null)
        {
            task.Title = dto.Title;
        }
        if (dto.Description is not null)
        {
            task.Description = dto.Description;
        }
        if (dto.Status is not null)
        {
            task.Status = dto.Status;
        }
        if (dto.DueDate is not null)
        {
            task.DueDate = dto.DueDate;
        }
        if (dto.Priority is not null)
        {
            task.Priority = dto.Priority;
        }

        task.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapToResponse(task);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task is null)
        {
            return false;
        }

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return true;
    }

    private static TaskResponseDto MapToResponse(TaskEntity task) =>
        new(
            task.Id,
            task.UserId,
            task.Tag,
            task.TagColor,
            task.Title,
            task.Description,
            task.Status,
            task.DueDate,
            task.Priority,
            task.CreatedAt,
            task.UpdatedAt
        );
}
