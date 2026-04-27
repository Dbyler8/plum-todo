using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("users")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UserResponseDto>>> GetAll()
    {
        var users = await userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserResponseDto>> GetById(int id)
    {
        var user = await userService.GetByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> Create(UserWriteDto dto)
    {
        var createdUser = await userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserResponseDto>> Update(int id, UserWriteDto dto)
    {
        var updatedUser = await userService.UpdateAsync(id, dto);
        if (updatedUser is null)
        {
            return NotFound();
        }

        return Ok(updatedUser);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<UserResponseDto>> Patch(int id, UserPatchDto dto)
    {
        var updatedUser = await userService.PatchAsync(id, dto);
        if (updatedUser is null)
        {
            return NotFound();
        }

        return Ok(updatedUser);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var wasDeleted = await userService.DeleteAsync(id);
        if (!wasDeleted)
        {
            return NotFound();
        }

        return Ok();
    }
}
