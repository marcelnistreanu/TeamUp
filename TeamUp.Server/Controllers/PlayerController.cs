using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeamUp.Server.Models;
using TeamUp.Server.Services;

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
        return Ok(result);
    }

    [HttpPost("addPlayer")]
    public async Task<ActionResult<Player>> AddPlayer(Player player)
    {
        var result = await _playerService.AddPlayer(player);
        return Ok(result);
    }

    [HttpPut("updatePlayer/{playerId}")]
    public async Task<ActionResult<Player>> UpdatePlayer(int playerId, Player player)
    {
        var result = await _playerService.UpdatePlayer(playerId, player);
        return Ok(result);
    }

    [HttpDelete("deletePlayer/{playerId}")]
    public async Task<ActionResult> DeletePlayer(int playerId)
    {
        await _playerService.DeletePlayer(playerId);
        return Ok(new MessageResponse("Player deleted successfully"));
    }
}
