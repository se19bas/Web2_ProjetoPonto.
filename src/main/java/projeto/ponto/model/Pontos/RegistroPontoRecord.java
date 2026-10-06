package projeto.ponto.model.Pontos;

import projeto.ponto.Enum.TipoPonto;

import java.time.LocalDateTime;

public record RegistroPontoRecord(Long idRegistroPonto, Long idFuncionario, Long idAreaPermitida, LocalDateTime dataHora, TipoPonto tipo,
                                  Double distanciaArea, Boolean dentroArea, Double latitude, Double longitude) {
}
