package projeto.ponto.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${api.security.token.secret}")
    private String secret;

    // Access token: 5 minutos
    public String gerarToken(UserDetails usuario) {
        Date agora = new Date();
        Date expiracao = new Date(
                agora.getTime() + 1000L * 60 * 5
        );

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("tipo", "access")
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getChave())
                .compact();
    }

    // Refresh token: 1 dias
    public String gerarRefreshToken(UserDetails usuario) {
        Date agora = new Date();
        Date expiracao = new Date(
                agora.getTime() + 1000L * 60 * 60 * 24
        );

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("tipo", "refresh")
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getChave())
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public boolean tokenValido(
            String token,
            UserDetails usuario
    ) {
        try {
            Claims claims = extrairClaims(token);

            return claims.getSubject()
                    .equals(usuario.getUsername())
                    && "access".equals(
                    claims.get("tipo", String.class)
            )
                    && claims.getExpiration().after(new Date());

        } catch (io.jsonwebtoken.JwtException
                 | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean refreshTokenValido(
            String token,
            UserDetails usuario
    ) {
        try {
            Claims claims = extrairClaims(token);

            return claims.getSubject()
                    .equals(usuario.getUsername())
                    && "refresh".equals(
                    claims.get("tipo", String.class)
            )
                    && claims.getExpiration().after(new Date());

        } catch (io.jsonwebtoken.JwtException
                 | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(getChave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getChave() {
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
    }
}