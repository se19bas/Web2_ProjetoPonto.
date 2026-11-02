package projeto.ponto.controller;

import projeto.ponto.dto.LoginRequest;
import projeto.ponto.dto.AuthResponse;
import projeto.ponto.dto.RefreshTokenRequest;
import projeto.ponto.service.AutenticacaoService;
import projeto.ponto.dto.UsuarioLogadoResponse;
import org.springframework.security.core.Authentication;
import projeto.ponto.dto.AlterarSenhaRequest;
import org.springframework.security.core.Authentication;
import projeto.ponto.dto.LogoutRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    private final AutenticacaoService authService;

    public AutenticacaoController(
            AutenticacaoService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody RefreshTokenRequest request) {

        AuthResponse resposta =
                authService.refresh(request);

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioLogadoResponse> consultarUsuarioLogado(
            Authentication authentication
    ) {

        UsuarioLogadoResponse usuario =
                authService.consultarUsuarioLogado(
                        authentication.getName()
                );

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/senha")
    public ResponseEntity<String> alterarSenha(
            @RequestBody AlterarSenhaRequest request,
            Authentication authentication
    ) {

        authService.alterarSenha(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok("Senha alterada com sucesso");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader("Authorization") String authorization,
            @RequestBody LogoutRequest request,
            Authentication authentication
    ) {

        String accessToken = authorization.substring(7);

        authService.logout(
                accessToken,
                request.refreshToken(),
                authentication.getName()
        );

        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}