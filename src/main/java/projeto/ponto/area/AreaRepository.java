package projeto.ponto.area;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import projeto.ponto.pontos.AreaMaisProxima;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    @Query(value = """
        SELECT
            a.idAreaPermitida AS idArea,
            ST_Distance_Sphere(
                a.Ponto,
                ST_SRID(
                    POINT(:longitude, :latitude),
                    4326
                )
            ) AS distancia
        FROM areapermitida a
        WHERE a.status = 'ATIVA'
        ORDER BY distancia ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<AreaMaisProxima> encontrarAreaMaisProxima(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude
    );
}