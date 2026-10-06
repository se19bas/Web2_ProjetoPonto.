package projeto.ponto.service;

import projeto.ponto.model.Gestor;
import projeto.ponto.repository.GestorRepository;
import org.springframework.stereotype.Service;
import projeto.ponto.model.Funcionario;
import projeto.ponto.repository.FuncionarioRepository;
import projeto.ponto.repository.UsuarioRepository;
import projeto.ponto.model.Usuario;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final GestorRepository gestorRepository;

    public FuncionarioService(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository,
            GestorRepository gestorRepository) {

        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.gestorRepository = gestorRepository;
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Optional<Funcionario> buscarPorId(Long id) {
        return funcionarioRepository.findById(id);
    }
    public Funcionario cadastrar(Funcionario funcionario) {

        Usuario usuario = funcionario.getUsuario();

        usuarioRepository.save(usuario);

        funcionario.setUsuario(usuario);

        return funcionarioRepository.save(funcionario);
    }

    public Funcionario atualizar(Long id, Funcionario funcionarioAtualizado) {

        Funcionario funcionarioExistente = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Usuario usuarioExistente = funcionarioExistente.getUsuario();
        Usuario usuarioAtualizado = funcionarioAtualizado.getUsuario();

        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setCpf(usuarioAtualizado.getCpf());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        usuarioExistente.setSenha(usuarioAtualizado.getSenha());
        usuarioExistente.setStatus(usuarioAtualizado.getStatus());

        funcionarioExistente.setCargo(funcionarioAtualizado.getCargo());
        funcionarioExistente.setGestor(funcionarioAtualizado.getGestor());

        usuarioRepository.save(usuarioExistente);

        return funcionarioRepository.save(funcionarioExistente);
    }


    public void inativar(Long id) {

        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Usuario usuario = funcionario.getUsuario();

        usuario.setStatus(Usuario.Status.INATIVO);

        usuarioRepository.save(usuario);
    }

    public Funcionario definirGestor(Long idFuncionario, Long idGestor) {

        Funcionario funcionario = funcionarioRepository.findById(idFuncionario)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Gestor gestor = gestorRepository.findById(idGestor)
                .orElseThrow(() -> new RuntimeException("Gestor não encontrado"));

        funcionario.setGestor(gestor);

        return funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarPorGestor(Long idGestor) {
        return funcionarioRepository.findByGestor_IdUsuario(idGestor);
    }

}   