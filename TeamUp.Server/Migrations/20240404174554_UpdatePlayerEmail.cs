using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamUp.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlayerEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreferredGame",
                table: "Players",
                newName: "Email");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "Players",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Players",
                newName: "PreferredGame");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }
    }
}
