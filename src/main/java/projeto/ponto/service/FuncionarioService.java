package projeto.ponto.service;

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

    public FuncionarioService(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository) {

        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
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
}