namespace back_end.Models;

public class Task
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Tag { get; set; }
    public int? TagColor { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = "To Do"; // "To Do", "In Progress", "Blocked", "Done"
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; } = "Medium"; // "Low", "Medium", "High"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key
    public User User { get; set; } = null!;

    // Navigation properties
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
