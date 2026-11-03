package projeto.ponto.dto;

public record AlterarSenhaRequest(
        String senhaAtual,
        String novaSenha
) {
}