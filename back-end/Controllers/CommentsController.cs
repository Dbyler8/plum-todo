using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
public class CommentsController(ICommentService commentService) : ControllerBase
{
    [HttpGet("comments")]
    public async Task<ActionResult<List<CommentResponseDto>>> GetAll()
    {
        var comments = await commentService.GetAllAsync();
        return Ok(comments);
    }

    [HttpGet("comments/{id:int}")]
    public async Task<ActionResult<CommentResponseDto>> GetById(int id)
    {
        var comment = await commentService.GetByIdAsync(id);
        if (comment is null)
        {
            return NotFound();
        }

        return Ok(comment);
    }

    [HttpGet("tasks/{taskId:int}/comments")]
    public async Task<ActionResult<List<CommentResponseDto>>> GetByTaskId(int taskId)
    {
        var comments = await commentService.GetByTaskIdAsync(taskId);
        return Ok(comments);
    }

    [HttpPost("comments")]
    public async Task<ActionResult<CommentResponseDto>> Create(CommentWriteDto dto)
    {
        var createdComment = await commentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdComment.Id }, createdComment);
    }

    [HttpPut("comments/{id:int}")]
    public async Task<ActionResult<CommentResponseDto>> Update(int id, CommentWriteDto dto)
    {
        var updatedComment = await commentService.UpdateAsync(id, dto);
        if (updatedComment is null)
        {
            return NotFound();
        }

        return Ok(updatedComment);
    }

    [HttpPatch("comments/{id:int}")]
    public async Task<ActionResult<CommentResponseDto>> Patch(int id, CommentPatchDto dto)
    {
        var updatedComment = await commentService.PatchAsync(id, dto);
        if (updatedComment is null)
        {
            return NotFound();
        }

        return Ok(updatedComment);
    }

    [HttpDelete("comments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var wasDeleted = await commentService.DeleteAsync(id);
        if (!wasDeleted)
        {
            return NotFound();
        }

        return Ok();
    }
}
