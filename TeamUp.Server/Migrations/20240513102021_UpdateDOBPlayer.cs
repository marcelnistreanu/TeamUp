using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamUp.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDOBPlayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayer_Games_gamesId",
                table: "GamePlayer");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayer_Players_playersId",
                table: "GamePlayer");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Players");

            migrationBuilder.RenameColumn(
                name: "playersId",
                table: "GamePlayer",
                newName: "PlayersId");

            migrationBuilder.RenameColumn(
                name: "gamesId",
                table: "GamePlayer",
                newName: "GamesId");

            migrationBuilder.RenameIndex(
                name: "IX_GamePlayer_playersId",
                table: "GamePlayer",
                newName: "IX_GamePlayer_PlayersId");

            migrationBuilder.AddColumn<DateTime>(
                name: "DOB",
                table: "Players",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayer_Games_GamesId",
                table: "GamePlayer",
                column: "GamesId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayer_Players_PlayersId",
                table: "GamePlayer",
                column: "PlayersId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayer_Games_GamesId",
                table: "GamePlayer");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayer_Players_PlayersId",
                table: "GamePlayer");

            migrationBuilder.DropColumn(
                name: "DOB",
                table: "Players");

            migrationBuilder.RenameColumn(
                name: "PlayersId",
                table: "GamePlayer",
                newName: "playersId");

            migrationBuilder.RenameColumn(
                name: "GamesId",
                table: "GamePlayer",
                newName: "gamesId");

            migrationBuilder.RenameIndex(
                name: "IX_GamePlayer_PlayersId",
                table: "GamePlayer",
                newName: "IX_GamePlayer_playersId");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Players",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayer_Games_gamesId",
                table: "GamePlayer",
                column: "gamesId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayer_Players_playersId",
                table: "GamePlayer",
                column: "playersId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
