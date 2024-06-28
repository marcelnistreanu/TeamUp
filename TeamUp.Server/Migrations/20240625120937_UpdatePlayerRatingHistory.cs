using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamUp.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlayerRatingHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewRating",
                table: "PlayerRatingHistory");

            migrationBuilder.RenameColumn(
                name: "PreviousRating",
                table: "PlayerRatingHistory",
                newName: "Rating");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "PlayerRatingHistory",
                newName: "PreviousRating");

            migrationBuilder.AddColumn<int>(
                name: "NewRating",
                table: "PlayerRatingHistory",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
