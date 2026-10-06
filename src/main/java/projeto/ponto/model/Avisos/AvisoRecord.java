package projeto.ponto.model.Avisos;

import projeto.ponto.Enum.AvisosStatus;

public record AvisoRecord(Long idAviso, Long idRegistro, Long idGestor, String mensagem, AvisosStatus status) {
}
