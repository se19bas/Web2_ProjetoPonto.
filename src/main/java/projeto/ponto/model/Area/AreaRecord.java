package projeto.ponto.model.Area;

import projeto.ponto.Enum.Status;

public record AreaRecord(Long id, String nome, Status status, Double longitude, Double latitude) {
}
