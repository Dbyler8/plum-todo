using back_end.Models;
using Microsoft.EntityFrameworkCore;
using TaskEntity = back_end.Models.Task;

namespace back_end.Data;

public static class DatabaseSeeder
{
    public static async System.Threading.Tasks.Task SeedAsync(DatabaseMapping db)
    {
        // Always start fresh on app boot for local development.
        await db.Database.EnsureDeletedAsync();
        await db.Database.MigrateAsync();

        var users = new List<User>
        {
            new()
            {
                Email = "maria.design@example.com",
                Name = "Maria Design",
                Title = "Product Designer",
                Department = "Design",
                Location = "Remote",
                Phone = "555-0101",
                Password = "password123",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Email = "donovanbyler@gmail.com",
                Name = "Donovan Byler",
                Title = "Project Lead",
                Department = "Product",
                Location = "Remote",
                Phone = "555-0102",
                Password = "password123",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Email = "nina.api@example.com",
                Name = "Nina Dev Ops",
                Title = "Backend Engineer",
                Department = "Engineering",
                Location = "Austin",
                Phone = "555-0103",
                Password = "password123",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        db.Users.AddRange(users);
        await db.SaveChangesAsync();

        var tasks = new List<TaskEntity>
        {
            // Done (8)
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Set up .NET project and EF Core",
                Description = "Scaffold the ASP.NET project, configure EF Core with SQLite, and run the initial migration.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-18),
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-18)
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Implement tasks CRUD API",
                Description = "Build GET, POST, PUT, PATCH, and DELETE endpoints for tasks with DTO validation.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-14),
                CreatedAt = DateTime.UtcNow.AddDays(-16),
                UpdatedAt = DateTime.UtcNow.AddDays(-14)
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Implement users and comments APIs",
                Description = "Add CRUD endpoints for users and comments, including the GET /tasks/{id}/comments route.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-12),
                CreatedAt = DateTime.UtcNow.AddDays(-14),
                UpdatedAt = DateTime.UtcNow.AddDays(-12)
            },
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Design board layout and color tokens",
                Description = "Define the board column layout, spacing scale, and color palette for statuses, priorities, and tags.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-16),
                CreatedAt = DateTime.UtcNow.AddDays(-18),
                UpdatedAt = DateTime.UtcNow.AddDays(-16)
            },
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Build task card component",
                Description = "Implement the reusable card component with assignee avatar, priority badge, tag chip, and due date.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Build auth page with email/password form",
                Description = "Implement the sign-in page with email and password inputs, validation, and error states.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-8),
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-8)
            },
            new()
            {
                UserId = users[1].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Wire drag-and-drop between columns",
                Description = "Integrate @atlaskit/pragmatic-drag-and-drop to move cards between board columns with smooth animations.",
                Status = "Done",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(-5),
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                UserId = users[1].Id,
                Tag = "Auth",
                TagColor = 2,
                Title = "Add Google OAuth support",
                Description = "Implement the optional Google auth code flow on the front end and the /auth/google exchange endpoint on the back end.",
                Status = "Done",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            // In Progress (3)
            new()
            {
                UserId = users[1].Id,
                Tag = "Documentation",
                TagColor = 4,
                Title = "Write README and setup guide",
                Description = "Document prerequisites, front-end and back-end setup steps, optional Google OAuth configuration, and how to run locally.",
                Status = "In Progress",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[1].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Connect task detail modal to comments API",
                Description = "Load and display existing comments, wire up the post comment form, and show loading/error states.",
                Status = "In Progress",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(3),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Accessibility contrast audit",
                Description = "Verify AA contrast ratios across board, auth, and modal screens. Fix any failing text/background combinations.",
                Status = "In Progress",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow
            },
            // Blocked (2)
            new()
            {
                UserId = users[1].Id,
                Tag = "Planning",
                TagColor = 5,
                Title = "Deploy to staging environment",
                Description = "Containerize the front end and back end and deploy to a staging host. Blocked on obtaining production credentials and deciding on a hosting provider.",
                Status = "Blocked",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Migrate from SQLite to PostgreSQL",
                Description = "Swap the EF Core provider and update connection config. Blocked until a database instance is provisioned.",
                Status = "Blocked",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(14),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow
            },
            // To Do (7)
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Add search and filter to board",
                Description = "Allow filtering cards by status, priority, or assignee. Add a search input that filters by task title.",
                Status = "To Do",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(10),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[0].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Improve mobile responsiveness",
                Description = "Rework board layout for small screens. Cards should stack vertically and column headers should be scrollable.",
                Status = "To Do",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(12),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Add pagination to task list API",
                Description = "Add skip/take query parameters to GET /tasks with sensible defaults and a max page size.",
                Status = "To Do",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(9),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Backend",
                TagColor = 9,
                Title = "Add request logging middleware",
                Description = "Log HTTP method, path, status code, and response time for every API request.",
                Status = "To Do",
                Priority = "Low",
                DueDate = DateTime.UtcNow.AddDays(14),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[2].Id,
                Tag = "Planning",
                TagColor = 5,
                Title = "Set up CI/CD pipeline",
                Description = "Configure a build and test pipeline. Run dotnet build and npm run build on every pull request.",
                Status = "To Do",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(18),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[1].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Add multi-user task assignment",
                Description = "Allow a task to be assigned to more than one user. Update the card, detail modal, and API to support a list of assignees.",
                Status = "To Do",
                Priority = "Low",
                DueDate = DateTime.UtcNow.AddDays(21),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                UserId = users[1].Id,
                Tag = "UI/UX",
                TagColor = 8,
                Title = "Add optimistic UI updates for task moves",
                Description = "Update column state immediately on drag-drop without waiting for the API response. Roll back on failure.",
                Status = "To Do",
                Priority = "Low",
                DueDate = DateTime.UtcNow.AddDays(16),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        db.Tasks.AddRange(tasks);
        await db.SaveChangesAsync();

        var comments = new List<Comment>
        {
            new()
            {
                TaskId = tasks[7].Id, // Add Google OAuth support (Done)
                UserId = users[2].Id,
                Content = "Back-end /auth/google endpoint is live. Make sure the front-end CLIENT_ID matches the one registered in Google Cloud.",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                TaskId = tasks[7].Id, // Add Google OAuth support (Done)
                UserId = users[0].Id,
                Content = "Tested the sign-in popup on Chrome and Firefox. Works smoothly. The 'or' divider design looks good too.",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                TaskId = tasks[9].Id, // Connect task detail modal to comments API (In Progress)
                UserId = users[0].Id,
                Content = "The loading spinner placement looks off on narrow modals. Can we align it with the comments section label?",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                TaskId = tasks[11].Id, // Deploy to staging (Blocked)
                UserId = users[2].Id,
                Content = "We need to agree on a hosting provider before moving forward. Options are Fly.io, Railway, or a basic VPS.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                TaskId = tasks[11].Id, // Deploy to staging (Blocked)
                UserId = users[1].Id,
                Content = "I'll look into Fly.io this week. Their free tier should cover the back-end for a POC.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                TaskId = tasks[12].Id, // Migrate from SQLite to PostgreSQL (Blocked)
                UserId = users[1].Id,
                Content = "Blocking concern: EF Core migrations will need to be re-run against the new provider. Test in a branch first.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        db.Comments.AddRange(comments);
        await db.SaveChangesAsync();
    }
}
