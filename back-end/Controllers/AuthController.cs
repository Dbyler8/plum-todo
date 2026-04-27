using back_end.DTOs;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
public class AuthController(IConfiguration configuration, ILogger<AuthController> logger) : ControllerBase
{
    private GoogleAuthorizationCodeFlow CreateFlow()
    {
        var clientId = configuration["GoogleAuth:ClientId"] ?? "";
        var clientSecret = configuration["GoogleAuth:ClientSecret"] ?? "";

        return new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            }
        });
    }

    [HttpPost("auth/google")]
    public async Task<IActionResult> GoogleSignIn([FromBody] GoogleAuthCodeDto dto)
    {
        var flow = CreateFlow();

        Google.Apis.Auth.OAuth2.Responses.TokenResponse tokenResponse;
        try
        {
            tokenResponse = await flow.ExchangeCodeForTokenAsync(
                userId: "",
                code: dto.Code,
                redirectUri: "postmessage",
                CancellationToken.None
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to exchange Google authorization code.");
            return BadRequest(new { error = "Failed to exchange authorization code." });
        }

        if (tokenResponse.IdToken is null)
        {
            return BadRequest(new { error = "No ID token returned from Google." });
        }

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(tokenResponse.IdToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to validate Google ID token.");
            return BadRequest(new { error = "Failed to validate Google ID token." });
        }

        return Ok(new GoogleAuthResponseDto(
            Email: payload.Email,
            AccessToken: tokenResponse.AccessToken,
            RefreshToken: tokenResponse.RefreshToken,
            IdToken: tokenResponse.IdToken
        ));
    }

    [HttpPost("auth/google/refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] GoogleRefreshTokenDto dto)
    {
        var flow = CreateFlow();

        Google.Apis.Auth.OAuth2.Responses.TokenResponse tokenResponse;
        try
        {
            tokenResponse = await flow.RefreshTokenAsync(
                userId: "",
                refreshToken: dto.RefreshToken,
                CancellationToken.None
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to refresh Google token.");
            return BadRequest(new { error = "Failed to refresh token." });
        }

        return Ok(new GoogleRefreshResponseDto(
            AccessToken: tokenResponse.AccessToken,
            IdToken: tokenResponse.IdToken ?? "",
            ExpiresInSeconds: tokenResponse.ExpiresInSeconds ?? 3600
        ));
    }
}
