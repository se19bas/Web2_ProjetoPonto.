package projeto.ponto.service;

import org.springframework.stereotype.Service;
import projeto.ponto.model.Funcionario;
import projeto.ponto.model.Gestor;
import projeto.ponto.repository.FuncionarioRepository;
import projeto.ponto.repository.GestorRepository;

import projeto.ponto.dto.FuncionarioHierarquiaDTO;
import projeto.ponto.dto.HierarquiaDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestorService {

    private final FuncionarioRepository funcionarioRepository;
    private final GestorRepository gestorRepository;

    public GestorService(
            FuncionarioRepository funcionarioRepository,
            GestorRepository gestorRepository) {

        this.funcionarioRepository = funcionarioRepository;
        this.gestorRepository = gestorRepository;
    }

    public Gestor promoverParaGestor(Long idFuncionario, String setor) {

        Funcionario funcionario = funcionarioRepository.findById(idFuncionario)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Gestor gestor = new Gestor();

        gestor.setFuncionario(funcionario);
        gestor.setSetor(setor);

        return gestorRepository.save(gestor);
    }

    public List<HierarquiaDTO> consultarHierarquia() {

        return gestorRepository.findAll()
                .stream()
                .map(gestor -> {

                    List<FuncionarioHierarquiaDTO> funcionarios =
                            funcionarioRepository
                                    .findByGestor_IdUsuario(gestor.getIdUsuario())
                                    .stream()
                                    .map(funcionario -> new FuncionarioHierarquiaDTO(
                                            funcionario.getIdUsuario(),
                                            funcionario.getUsuario().getNome(),
                                            funcionario.getCargo()
                                    ))
                                    .collect(Collectors.toList());

                    return new HierarquiaDTO(
                            gestor.getIdUsuario(),
                            gestor.getFuncionario().getUsuario().getNome(),
                            gestor.getSetor(),
                            funcionarios
                    );
                })
                .collect(Collectors.toList());
    }

}