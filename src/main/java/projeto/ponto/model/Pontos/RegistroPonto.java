package projeto.ponto.model.Pontos;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import projeto.ponto.model.Area.Area;
import projeto.ponto.model.Funcionario;
import projeto.ponto.Enum.TipoPonto;

import java.time.LocalDateTime;

@Entity
@Table(name = "registroponto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroPonto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRegistroPonto")
    private Long idRegistroPonto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "idFuncionario",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_registro_funcionario")
    )
    private Funcionario funcionario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "idAreaPermitida",
            foreignKey = @ForeignKey(name = "fk_registro_area")
    )
    private Area areaPermitida;

    @Column(
            name = "data_hora",
            nullable = false
    )
    @Builder.Default
    private LocalDateTime dataHora = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoPonto tipo;

    @Column(name = "distancia_area")
    private Double distanciaArea;

    @Column(
            name = "dentro_area",
            nullable = false
    )
    private Boolean dentroArea;

    @Column(
            name = "ponto",
            nullable = false,
            columnDefinition = "POINT SRID 4326"
    )
    private Point ponto;
}