package projeto.ponto.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import projeto.ponto.Enum.AvisosStatus;
import projeto.ponto.dto.ConverterAviso;
import projeto.ponto.model.Avisos.Aviso;
import projeto.ponto.model.Avisos.AvisoRecord;
import projeto.ponto.repository.AvisoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvisoService {

    private final AvisoRepository avisoRepository;

    public AvisoRecord consultarAviso(Long id) {
        Aviso aviso = avisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aviso não encontrado"));

        return ConverterAviso.toRecord(aviso);
    }

    public AvisoRecord lerAviso(Long id) {
        Aviso aviso = avisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aviso não encontrado"));

        aviso.setStatus(AvisosStatus.LIDO);

        Aviso avisoSalvo = avisoRepository.save(aviso);

        return ConverterAviso.toRecord(avisoSalvo);
    }

    public List<AvisoRecord> avisosParaGestor(Long idGestor) {
        return avisoRepository.findByGestor_IdUsuario(idGestor)
                .stream()
                .map(ConverterAviso::toRecord)
                .toList();
    }
}