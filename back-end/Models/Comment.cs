namespace back_end.Models;

public class Comment
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int UserId { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign keys
    public Task Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
