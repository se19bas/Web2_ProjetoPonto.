package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Gestor;

public interface GestorRepository extends JpaRepository<Gestor, Long> {
}