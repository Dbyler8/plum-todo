namespace back_end.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }
    public string? Location { get; set; }
    public string? Phone { get; set; }
    // TODO: For production, replace plaintext password storage with a salted password hash.
    public required string Password { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Task> Tasks { get; set; } = new List<Task>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
