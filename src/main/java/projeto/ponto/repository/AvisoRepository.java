package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Avisos.Aviso;

import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByGestor_IdUsuario(Long idGestor);
}
