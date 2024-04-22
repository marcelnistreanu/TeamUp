using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;
using TeamUp.Server.Services;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Controllers;
[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    public GameController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet("getGames")]
    public async Task<ActionResult<List<GameDto>>> GetGames()
    {
        var result = await _gameService.GetGames();
        if (result.IsSuccess)
            return Ok(result);
        return NotFound();
    }

    [HttpPost("addGame")]
    public async Task<ActionResult<Game>> AddGame(CreateGameDto gameDto)
    {
        var result = await _gameService.AddGame(gameDto);
        if (result.IsSuccess)
            return Ok(result);
        return BadRequest(result.Error);
    }

    [HttpDelete("deleteGame/{gameId}")]
    public async Task<ActionResult> DeleteGame(int gameId)
    {
        var result = await _gameService.DeleteGame(gameId);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        if (result.IsFailure && result.Error.Code == "record.not.found")
        {
            return NotFound(result.Error);
        }

        return BadRequest(result);
    }

    [HttpPut("updateGame/{gameId}")]
    public async Task<ActionResult> UpdateGame(int gameId, UpdateGameDto gameDto)
    {
        var result = await _gameService.UpdateGame(gameId, gameDto);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        if (result.IsFailure && result.Error.Code == "record.not.found")
        {
            return NotFound(result.Error);
        }

        return BadRequest(result);
    }
}
