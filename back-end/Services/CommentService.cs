using back_end.Data;
using back_end.DTOs;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class CommentService(DatabaseMapping db) : ICommentService
{
    public async Task<List<CommentResponseDto>> GetAllAsync()
    {
        var comments = await db.Comments.ToListAsync();
        return comments.Select(MapToResponse).ToList();
    }

    public async Task<CommentResponseDto?> GetByIdAsync(int id)
    {
        var comment = await db.Comments.FindAsync(id);
        return comment is null ? null : MapToResponse(comment);
    }

    public async Task<List<CommentResponseDto>> GetByTaskIdAsync(int taskId)
    {
        var comments = await db.Comments
            .Where(c => c.TaskId == taskId)
            .ToListAsync();

        return comments.Select(MapToResponse).ToList();
    }

    public async Task<CommentResponseDto> CreateAsync(CommentWriteDto dto)
    {
        var comment = new Comment
        {
            TaskId = dto.TaskId,
            UserId = dto.UserId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        return MapToResponse(comment);
    }

    public async Task<CommentResponseDto?> UpdateAsync(int id, CommentWriteDto dto)
    {
        var comment = await db.Comments.FindAsync(id);
        if (comment is null)
        {
            return null;
        }

        comment.TaskId = dto.TaskId;
        comment.UserId = dto.UserId;
        comment.Content = dto.Content;
        comment.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToResponse(comment);
    }

    public async Task<CommentResponseDto?> PatchAsync(int id, CommentPatchDto dto)
    {
        var comment = await db.Comments.FindAsync(id);
        if (comment is null)
        {
            return null;
        }

        if (dto.Content is not null)
        {
            comment.Content = dto.Content;
        }

        comment.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapToResponse(comment);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var comment = await db.Comments.FindAsync(id);
        if (comment is null)
        {
            return false;
        }

        db.Comments.Remove(comment);
        await db.SaveChangesAsync();
        return true;
    }

    private static CommentResponseDto MapToResponse(Comment comment) =>
        new(
            comment.Id,
            comment.TaskId,
            comment.UserId,
            comment.Content,
            comment.CreatedAt,
            comment.UpdatedAt
        );
}
