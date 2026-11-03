package projeto.ponto.dto;

public record LoginRequest(
        String email,
        String senha
) {}