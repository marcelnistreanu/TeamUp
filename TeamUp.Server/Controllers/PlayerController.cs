using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;
using TeamUp.Server.Services;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService _playerService;
    public PlayerController(IPlayerService playerService) 
    { 
        _playerService = playerService;
    }

    [HttpGet("getPlayers")]
    public async Task<ActionResult<List<Player>>> GetPlayers()
    {
        var result = await _playerService.GetPlayers();
        if(result.IsSuccess)
            return Ok(result);
        return NotFound();
    }

    [HttpPost("addPlayer")]
    public async Task<ActionResult<Player>> AddPlayer(Player player)
    {
        var result = await _playerService.AddPlayer(player);
        if(result.IsSuccess)
            return Ok(result);
        return BadRequest(result.Error);
    }

    [HttpPut("updatePlayer/{playerId}")]
    public async Task<ActionResult<Player>> UpdatePlayer(int playerId, Player player)
    {
        var result = await _playerService.UpdatePlayer(playerId, player);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        if(result.IsFailure && result.Error.Code == "record.not.found")
        {
            return NotFound(result.Error);
        }

        return BadRequest(result);
    }

    [HttpDelete("deletePlayer/{playerId}")]
    public async Task<ActionResult> DeletePlayer(int playerId)
    {
        var result = await _playerService.DeletePlayer(playerId);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        if(result.IsFailure && result.Error.Code == "record.not.found")
        {
            return NotFound(result.Error);
        }

        return BadRequest(result);
    }
}
