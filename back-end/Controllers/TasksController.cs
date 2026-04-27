using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("tasks")]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TaskResponseDto>>> GetAll()
    {
        var tasks = await taskService.GetAllAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskResponseDto>> GetById(int id)
    {
        var task = await taskService.GetByIdAsync(id);
        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponseDto>> Create(TaskWriteDto dto)
    {
        var createdTask = await taskService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskResponseDto>> Update(int id, TaskWriteDto dto)
    {
        var updatedTask = await taskService.UpdateAsync(id, dto);
        if (updatedTask is null)
        {
            return NotFound();
        }

        return Ok(updatedTask);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<TaskResponseDto>> Patch(int id, TaskPatchDto dto)
    {
        var updatedTask = await taskService.PatchAsync(id, dto);
        if (updatedTask is null)
        {
            return NotFound();
        }

        return Ok(updatedTask);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var wasDeleted = await taskService.DeleteAsync(id);
        if (!wasDeleted)
        {
            return NotFound();
        }

        return Ok();
    }
}
