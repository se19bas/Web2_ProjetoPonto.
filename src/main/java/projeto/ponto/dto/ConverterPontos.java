package projeto.ponto.dto;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import projeto.ponto.model.Area.Area;
import projeto.ponto.model.Funcionario;
import projeto.ponto.model.Pontos.RegistroPonto;
import projeto.ponto.model.Pontos.RegistroPontoRecord;

public final class ConverterPontos {

    private static final int SRID = 4326;

    public ConverterPontos() {
    }

    /**
     * Converte Record para Entidade.
     *
     * @param record registro recebido pela API
     * @param funcionario funcionário relacionado ao registro
     * @param area área permitida relacionada ao registro
     * @return entidade RegistroPonto
     */
    public static RegistroPonto toEntity(
            RegistroPontoRecord record,
            Funcionario funcionario,
            Area area
    ) {

        Point ponto = criarPoint(
                record.latitude(),
                record.longitude()
        );

        return RegistroPonto.builder()
                .idRegistroPonto(record.idRegistroPonto())
                .funcionario(funcionario)
                .areaPermitida(area)
                .dataHora(record.dataHora())
                .tipo(record.tipo())
                .distanciaArea(record.distanciaArea())
                .dentroArea(record.dentroArea())
                .ponto(ponto)
                .build();
    }

    /**
     * Converte Entidade para Record.
     *
     * @param entity entidade RegistroPonto
     * @return RegistroPontoRecord
     */
    public static RegistroPontoRecord toRecord(
            RegistroPonto entity
    ) {

        Point ponto = entity.getPonto();

        Double latitude = ponto != null
                ? ponto.getY()
                : null;

        Double longitude = ponto != null
                ? ponto.getX()
                : null;

        Long idFuncionario = entity.getFuncionario() != null
                ? entity.getFuncionario().getIdUsuario()
                : null;

        Long idAreaPermitida = entity.getAreaPermitida() != null
                ? entity.getAreaPermitida().getIdAreaPermitida()
                : null;

        return new RegistroPontoRecord(
                entity.getIdRegistroPonto(),
                idFuncionario,
                idAreaPermitida,
                entity.getDataHora(),
                entity.getTipo(),
                entity.getDistanciaArea(),
                entity.getDentroArea(),
                latitude,
                longitude
        );
    }

    public static Point criarPoint(
            Double latitude,
            Double longitude
    ) {

        if (latitude == null || longitude == null) {
            return null;
        }

        GeometryFactory geometryFactory =
                new GeometryFactory(
                        new PrecisionModel(),
                        SRID
                );

        // X = longitude
        // Y = latitude
        return geometryFactory.createPoint(
                new Coordinate(longitude, latitude)
        );
    }
}
