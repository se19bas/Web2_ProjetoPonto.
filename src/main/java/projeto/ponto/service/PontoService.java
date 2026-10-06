package projeto.ponto.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import projeto.ponto.model.Area.Area;
import projeto.ponto.model.Pontos.AreaMaisProxima;
import projeto.ponto.dto.ConverterPontos;
import projeto.ponto.repository.AreaRepository;
import projeto.ponto.model.Avisos.Aviso;
import projeto.ponto.repository.AvisoRepository;
import projeto.ponto.Enum.AvisosStatus;
import projeto.ponto.model.Funcionario;
import projeto.ponto.model.Gestor;
import projeto.ponto.model.Pontos.RegistroPonto;
import projeto.ponto.model.Pontos.RegistroPontoRecord;
import projeto.ponto.repository.FuncionarioRepository;
import projeto.ponto.repository.RegistroPontoRepository;

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
