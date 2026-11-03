package projeto.ponto.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import projeto.ponto.Enum.AvisosStatus;
import projeto.ponto.dto.ConverterAviso;
import projeto.ponto.model.Avisos.Aviso;
import projeto.ponto.model.Avisos.AvisoRecord;
import projeto.ponto.repository.AvisoRepository;
import projeto.ponto.repository.UsuarioRepository;
import projeto.ponto.model.Usuario;
import projeto.ponto.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvisoService {

    private final AvisoRepository avisoRepository;
    private final UsuarioRepository usuarioRepository;

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

    public List<AvisoRecord> meusAvisos(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        Long idUsuario = usuario.getIdUsuario();

        return avisoRepository
                .findByRegistro_Funcionario_IdUsuario(idUsuario)
                .stream()
                .map(ConverterAviso::toRecord)
                .toList();
    }
}