package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import projeto.ponto.model.Area.Area;
import projeto.ponto.model.Pontos.AreaMaisProxima;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    @Query(value = """
        SELECT
            a.idAreaPermitida AS "idArea",
            ST_DistanceSphere(
                a.ponto,
                ST_SetSRID(
                    ST_MakePoint(:longitude, :latitude),
                    4326
                )
            ) AS "distancia"
        FROM areapermitida a
        WHERE a.status = 'ATIVA'
        ORDER BY "distancia" ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<AreaMaisProxima> encontrarAreaMaisProxima(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude
    );
}