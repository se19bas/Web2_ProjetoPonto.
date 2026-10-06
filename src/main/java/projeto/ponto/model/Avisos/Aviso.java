package projeto.ponto.model.Avisos;

import jakarta.persistence.*;
import lombok.*;
import projeto.ponto.Enum.AvisosStatus;
import projeto.ponto.model.Gestor;
import projeto.ponto.model.Pontos.RegistroPonto;

@Entity
@Table(name = "aviso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aviso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAviso")
    private Long idAviso;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idRegistro", nullable = false)
    private RegistroPonto registro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idGestor", nullable = false)
    private Gestor gestor;

    @Column(
            name = "mensagem",
            nullable = false,
            length = 500
    )
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false
    )
    @Builder.Default
    private AvisosStatus status = AvisosStatus.NAO_LIDO;
}
