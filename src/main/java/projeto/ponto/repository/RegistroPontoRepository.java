package projeto.ponto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projeto.ponto.model.Pontos.RegistroPonto;

import java.util.List;

@Repository
public interface RegistroPontoRepository
        extends JpaRepository<RegistroPonto, Long> {
    List<RegistroPonto> findByFuncionario_IdUsuario(Long idFuncionario);
}
