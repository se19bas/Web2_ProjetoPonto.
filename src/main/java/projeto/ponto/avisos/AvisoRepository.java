package projeto.ponto.avisos;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByGestor_IdUsuario(Long idGestor);
}
