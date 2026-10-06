package projeto.ponto.service;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import projeto.ponto.Enum.Status;
import projeto.ponto.model.Area.Area;
import projeto.ponto.model.Area.AreaRecord;
import projeto.ponto.repository.AreaRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {
    private final AreaRepository areaRepository;

    public AreaRecord getAreaById(Long id){
        return areaToRecord(areaRepository.findById(id).orElseThrow(() -> new RuntimeException("Area não Existe")));
    }
    public List<AreaRecord> getAllAreas(){
        return areaRepository.findAll().stream().map(this::areaToRecord).toList();
    }
    public AreaRecord AdicionarArea(AreaRecord record){
        Area area = recordToArea(record);
        area.setStatus(Status.ATIVA);

        Area areaSalva = areaRepository.save(area);

        return areaToRecord(areaSalva);
    }
    public AreaRecord inativarArea(Long id){
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área não encontrada"));

        area.setStatus(Status.INATIVA);

        Area areaAtualizada = areaRepository.save(area);

        return areaToRecord(areaAtualizada);
    }
    public AreaRecord alterarTabela(AreaRecord changed,Long id){
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área não encontrada"));

        area.setNome(changed.nome());

        areaRepository.save(area);

        return areaToRecord(area);
    }






    public AreaRecord areaToRecord(Area area){
        Point ponto = area.getPonto();

        return new AreaRecord(
                area.getIdAreaPermitida(),
                area.getNome(),
                area.getStatus(),
                ponto != null ? ponto.getX() : null,
                ponto != null ? ponto.getY() : null
        );
    }
    public Area recordToArea(AreaRecord record){
        Point ponto = null;

        if (record.longitude() != null && record.latitude() != null) {
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

            ponto = geometryFactory.createPoint(
                    new Coordinate(record.longitude(), record.latitude())
            );
        }

        return new Area(
                record.id(),
                record.nome(),
                record.status(),
                ponto
        );
    }
}
