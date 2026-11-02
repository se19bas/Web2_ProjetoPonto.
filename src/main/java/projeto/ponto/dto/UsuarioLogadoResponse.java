package projeto.ponto.dto;

import projeto.ponto.model.Usuario;

public record UsuarioLogadoResponse(
        Long idUsuario,
        String nome,
        String cpf,
        String email,
        Usuario.Status status
) {
}