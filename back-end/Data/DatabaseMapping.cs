using Microsoft.EntityFrameworkCore;
using back_end.Models;
using Task = back_end.Models.Task;

namespace back_end.Data;

public class DatabaseMapping : DbContext
{
    public DatabaseMapping(DbContextOptions<DatabaseMapping> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure cascading deletes
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Task)
            .WithMany(t => t.Comments)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Task>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
