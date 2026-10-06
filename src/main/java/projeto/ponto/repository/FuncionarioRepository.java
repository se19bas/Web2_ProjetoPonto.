package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Funcionario;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    List<Funcionario> findByGestor_IdUsuario(Long idGestor);
}