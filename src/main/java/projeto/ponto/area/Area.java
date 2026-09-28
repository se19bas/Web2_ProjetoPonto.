package projeto.ponto.area;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "areapermitida")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAreaPermitida")
    private Long idAreaPermitida;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ATIVA;

    @Column(name = "Ponto", nullable = false, columnDefinition = "POINT SRID 4326")
    private Point ponto;


}