package projeto.ponto.pontos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroPontoRepository
        extends JpaRepository<RegistroPonto, Long> {
}
