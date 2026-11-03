package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projeto.ponto.model.Avisos.Aviso;

import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByGestor_IdUsuario(Long idGestor);
    List<Aviso> findByRegistro_Funcionario_IdUsuario(Long idUsuario);
}
