using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamUp.Server.Migrations;

/// <inheritdoc />
public partial class UpdateStatusColumn : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "Games",
            type: "nvarchar(24)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "TEXT");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "Games",
            type: "TEXT",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(24)");
    }
}
