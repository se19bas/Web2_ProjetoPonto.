package projeto.ponto.pontos;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import projeto.ponto.area.Area;
import projeto.ponto.area.AreaRecord;
import projeto.ponto.area.AreaRepository;
import projeto.ponto.avisos.Aviso;
import projeto.ponto.avisos.AvisoRepository;
import projeto.ponto.avisos.AvisosStatus;
import projeto.ponto.model.Funcionario;
import projeto.ponto.model.Gestor;
import projeto.ponto.repository.FuncionarioRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PontoService {

    private static final double DISTANCIA_MAXIMA_METROS = 200.0;

    private final RegistroPontoRepository registroPontoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final AreaRepository areaRepository;
    private final AvisoRepository avisoRepository;

    public RegistroPontoRecord registrar(
            RegistroPontoRecord record
    ) {

        Funcionario funcionario =
                funcionarioRepository.getReferenceById(
                        record.idFuncionario()
                );

        Area area = null;
        Double distanciaArea = null;

        Optional<AreaMaisProxima> resultado =
                areaRepository.encontrarAreaMaisProxima(
                        record.latitude(),
                        record.longitude()
                );

        if (resultado.isPresent()) {

            AreaMaisProxima projection =
                    resultado.get();

            area =
                    areaRepository.getReferenceById(
                            projection.getIdArea()
                    );

            distanciaArea =
                    projection.getDistancia();
        }

        boolean dentroArea =
                distanciaArea != null
                        && distanciaArea <= DISTANCIA_MAXIMA_METROS;

        RegistroPonto registro =
                RegistroPonto.builder()
                        .funcionario(funcionario)
                        .areaPermitida(area)
                        .dataHora(record.dataHora())
                        .tipo(record.tipo())
                        .distanciaArea(distanciaArea)
                        .dentroArea(dentroArea)
                        .ponto(
                                ConverterPontos.criarPoint(
                                        record.latitude(),
                                        record.longitude()
                                )
                        )
                        .build();

        RegistroPonto salvo =
                registroPontoRepository.save(registro);

        if (!dentroArea) {

            Gestor gestor = funcionario.getGestor();

            if (gestor != null) {

                Aviso aviso =
                        Aviso.builder()
                                .registro(salvo)
                                .gestor(gestor)
                                .mensagem(
                                        criarMensagemAviso(
                                                distanciaArea
                                        )
                                )
                                .status(AvisosStatus.NAO_LIDO)
                                .build();

                avisoRepository.save(aviso);
            }
        }

        return ConverterPontos.toRecord(salvo);
    }

    private String criarMensagemAviso(
            Double distanciaArea
    ) {

        if (distanciaArea == null) {

            return "Funcionário registrou ponto sem uma área permitida próxima.";
        }

        return String.format(
                "Funcionário registrou ponto fora da área permitida. " +
                        "Distância da área mais próxima: %.2f metros.",
                distanciaArea
        );
    }

    public List<RegistroPontoRecord> getAllPontos(){
        return registroPontoRepository.findAll().stream().map(ConverterPontos::toRecord).toList();
    }

    public RegistroPontoRecord getPontoById(Long id) {
        RegistroPonto registro = registroPontoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de ponto não encontrado"));

        return ConverterPontos.toRecord(registro);
    }
    public List<RegistroPontoRecord> getPontosByFuncionario(Long idFuncionario) {

        return registroPontoRepository
                .findByFuncionario_IdUsuario(idFuncionario)
                .stream()
                .map(ConverterPontos::toRecord)
                .toList();
    }
}
