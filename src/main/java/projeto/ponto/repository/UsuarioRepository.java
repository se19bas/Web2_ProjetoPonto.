package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}