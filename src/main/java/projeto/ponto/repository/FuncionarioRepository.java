package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
}