package projeto.ponto.dto;

public record AuthResponse(
        String token,
        String refreshToken
) {}