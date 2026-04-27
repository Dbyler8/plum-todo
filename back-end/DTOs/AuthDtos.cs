using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public record GoogleAuthCodeDto(
    [Required] string Code
);

public record GoogleRefreshTokenDto(
    [Required] string RefreshToken
);

public record GoogleAuthResponseDto(
    string Email,
    string AccessToken,
    string? RefreshToken,
    string IdToken
);

public record GoogleRefreshResponseDto(
    string AccessToken,
    string IdToken,
    long ExpiresInSeconds
);
