using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class MoveTagFieldsToTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tag",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TagColor",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Tag",
                table: "Tasks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TagColor",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tag",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "TagColor",
                table: "Tasks");

            migrationBuilder.AddColumn<string>(
                name: "Tag",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TagColor",
                table: "Users",
                type: "INTEGER",
                nullable: true);
        }
    }
}
