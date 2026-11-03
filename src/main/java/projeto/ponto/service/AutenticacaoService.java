
package projeto.ponto.service;

import projeto.ponto.dto.AuthResponse;
import projeto.ponto.dto.LoginRequest;
import projeto.ponto.dto.RefreshTokenRequest;
import projeto.ponto.security.JwtService;
import projeto.ponto.repository.UsuarioRepository;
import projeto.ponto.model.Usuario;
import projeto.ponto.dto.UsuarioLogadoResponse;
import projeto.ponto.dto.AlterarSenhaRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

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
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRevocationService tokenRevocationService;

    public AutenticacaoService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserDetailsService userDetailsService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            TokenRevocationService tokenRevocationService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRevocationService = tokenRevocationService;
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

            if (tokenRevocationService.estaRevogado(refreshToken)) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Refresh token revogado"
                );
            }

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

    public UsuarioLogadoResponse consultarUsuarioLogado(
            String email
    ) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        return new UsuarioLogadoResponse(
                usuario.getIdUsuario(),
                usuario.getNome(),
                usuario.getCpf(),
                usuario.getEmail(),
                usuario.getStatus()
        );
    }

    public void alterarSenha(
            String email,
            AlterarSenhaRequest request
    ) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        if (!passwordEncoder.matches(
                request.senhaAtual(),
                usuario.getSenha()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Senha atual incorreta"
            );
        }

        usuario.setSenha(
                passwordEncoder.encode(request.novaSenha())
        );

        usuarioRepository.save(usuario);
    }

    public void logout(
            String accessToken,
            String refreshToken,
            String email
    ) {

        UserDetails usuario =
                userDetailsService.loadUserByUsername(email);

        if (!jwtService.tokenValido(accessToken, usuario)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Access token inválido"
            );
        }

        if (!jwtService.refreshTokenValido(refreshToken, usuario)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token inválido"
            );
        }

        tokenRevocationService.revogar(
                accessToken,
                jwtService.extrairExpiracao(accessToken)
        );

        tokenRevocationService.revogar(
                refreshToken,
                jwtService.extrairExpiracao(refreshToken)
        );
    }
}