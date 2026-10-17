
package projeto.ponto.service;

import projeto.ponto.dto.AuthResponse;
import projeto.ponto.dto.LoginRequest;
import projeto.ponto.dto.RefreshTokenRequest;
import projeto.ponto.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AutenticacaoService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AutenticacaoService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse login(LoginRequest request) {

        Authentication autenticacao =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.senha()
                        )
                );

        UserDetails usuario =
                (UserDetails) autenticacao.getPrincipal();

        String token = jwtService.gerarToken(usuario);

        String refreshToken =
                jwtService.gerarRefreshToken(usuario);

        return new AuthResponse(token, refreshToken);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {

        try {
            String refreshToken = request.refreshToken();

            if (refreshToken == null || refreshToken.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Refresh token não informado"
                );
            }

            String email = jwtService.extrairEmail(refreshToken);

            UserDetails usuario =
                    userDetailsService.loadUserByUsername(email);

            if (!jwtService.refreshTokenValido(
                    refreshToken, usuario)) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Refresh token inválido ou expirado"
                );
            }

            String novoToken = jwtService.gerarToken(usuario);

            return new AuthResponse(novoToken, refreshToken);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token inválido ou expirado"
            );
        }
    }
}