package projeto.ponto.avisos;

public record AvisoRecord(Long idAviso, Long idRegistro, Long idGestor, String mensagem, AvisosStatus status) {
}
