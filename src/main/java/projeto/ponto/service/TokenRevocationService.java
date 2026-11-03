package projeto.ponto.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenRevocationService {

    private final Map<String, Instant> tokensRevogados =
            new ConcurrentHashMap<>();

    public void revogar(String token, Date expiracao) {
        tokensRevogados.put(token, expiracao.toInstant());
    }

    public boolean estaRevogado(String token) {

        Instant expiracao = tokensRevogados.get(token);

        if (expiracao == null) {
            return false;
        }

        if (!expiracao.isAfter(Instant.now())) {
            tokensRevogados.remove(token);
            return false;
        }

        return true;
    }
}